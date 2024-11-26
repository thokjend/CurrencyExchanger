import { useState } from "react";
import { createAccount, login } from "../services/LoginService";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [registerMode, setRegisterMode] = useState(false);
  const [infoText, setInfoText] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();

  const handleData = async (
    username: string,
    password: string,
    registerMode: boolean
  ) => {
    try {
      let response;
      if (registerMode) {
        response = await createAccount(username, password);
      } else {
        response = await login(username, password);
      }

      if (response?.success) {
        setIsSuccess(true);
        setInfoText(registerMode ? "Success! Account created" : "");
        if (!registerMode) {
          navigate("/main");
          localStorage.setItem("username", username);
        } else {
          setRegisterMode(false);
        }
      } else {
        setIsSuccess(false);
        setInfoText(
          registerMode
            ? "Account creation failed. User already exist."
            : "Login failed. Invalid username or password."
        );
      }
    } catch (error) {
      console.error("Error:", error);
      setInfoText("An error occurred. Please try again.");
    }
  };

  const reset = () => {
    setUsername("");
    setPassword("");
    setInfoText("");
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <div className="border w-25 h-25 d-flex flex-column rounded">
        <div className="text-white text-center fs-2 fw-bolder">
          {!registerMode ? "Login" : "Register"}
        </div>
        <div className="w-100 h-100 d-flex flex-column align-items-center text-white">
          <input
            className="mt-2 w-75 fw-bold"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="mt-2 w-75 fw-bold"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="mt-2 w-75 fs-5 fw-bold"
            onClick={() => handleData(username, password, registerMode)}
            disabled={username === "" || password === ""}
          >
            {!registerMode ? "Login" : "Create Account"}
          </button>
          {!registerMode ? (
            <div>
              Don't have an account?{" "}
              <span
                className="hover"
                onClick={() => {
                  setRegisterMode(true);
                  reset();
                }}
              >
                Register
              </span>
            </div>
          ) : (
            <div>
              Already have an account?{" "}
              <span
                className="hover"
                onClick={() => {
                  setRegisterMode(false);
                  reset();
                }}
              >
                Login
              </span>
            </div>
          )}

          <div
            className={
              isSuccess
                ? "text-success fs-5 fw-bold"
                : "text-danger fs-5 fw-bold"
            }
          >
            {infoText}
          </div>
        </div>
      </div>
    </div>
  );
}
