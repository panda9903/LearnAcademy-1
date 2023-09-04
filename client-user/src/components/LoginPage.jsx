import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { userState } from "../store/atoms/user";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

import "../index.css";
import { toast } from "react-hot-toast";

function LoginPage() {
  const [user, setUser] = useState({ email: "", password: "" });
  const setUserRecoil = useSetRecoilState(userState);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  console.log({ user });
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (user.email.trim() === "" || user.password.trim() == "") {
      setMessage("Email/Password field cannot be empty.");
      return;
    } else {
      try {
        setIsLoading(true);
        const response = await axios.post(
          "https://jeysiva-learn-academy-server.vercel.app/users/login",
          {
            username: user.email,
            password: user.password,
          }
        );

        setUserRecoil({
          email: user.email,
          username: user.email.split("@")[0].toUpperCase(),
          isLoggedIn: true,
        });
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("email", user.email);

        setMessage("");
        toast.success(response.data.message);
        setIsLoading(false);
        navigate("/courses");
      } catch (err) {
        console.log(err);
        setMessage(err.response.data.message);
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="page">
      <div className="title">
        <Typography
          variant="h4"
          component="div"
          style={{
            flexGrow: 1,
            padding: "10px",
            borderRadius: "4px",
            fontWeight: "bold",
            color: "#101460",
            textAlign: "center",
            marginTop: "50px",
            marginBottom: "10px",
          }}
        >
          Login To LearnAcademy
        </Typography>
        {message && (
          <div>
            <p
              style={{
                textAlign: "center",
                color: "#bc1c44",
                fontWeight: "500",
                fontSize: "20px",
                marginBottom: "5px",
              }}
            >
              {message}
            </p>
          </div>
        )}
      </div>
      <Card className="form">
        <TextField
          id="email"
          label="Email"
          variant="outlined"
          type="text"
          value={user.email}
          onChange={(e) =>
            setUser((prev) => ({ ...prev, email: e.target.value }))
          }
        />
        <TextField
          id="password"
          label="Password"
          variant="outlined"
          type="password"
          value={user.password}
          onChange={(e) =>
            setUser((prev) => ({ ...prev, password: e.target.value }))
          }
        />
        {isLoading ? (
          <Button
            style={{ backgroundColor: "#101460" }}
            className="button"
            variant="contained"
            onClick={handleLogin}
          >
            <CircularProgress style={{ width: "20px", height: "20px" }} />
          </Button>
        ) : (
          <Button
            style={{ backgroundColor: "#101460" }}
            className="button"
            variant="contained"
            onClick={handleLogin}
          >
            Login
          </Button>
        )}

        <br></br>
        <div>
          <h3 style={{ fontWeight: "500" }}>
            New here? Click here to register new account.
          </h3>
          <br />
          <Button
            style={{ backgroundColor: "#101460" }}
            className="button"
            variant="contained"
            onClick={() => navigate("/register")}
          >
            Register
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default LoginPage;
