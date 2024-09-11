import React, { useState } from "react";
import "./LoginForm.css";
import { IoEyeSharp, IoMailSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import auth from "../../utils/firebase";

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUpClick = () => {
    navigate("/sign-up");
  };

  const onLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);

      console.log("Login successful!");
      navigate("/homepage");
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="wrapper">
      <div className="wrapper_alpha">
        {/* <img src={logo} alt="Site Logo" className="logo" /> */}
        <form action="">
          <h1>Welcome to On-Site</h1>
          <div className="register-link">
            <p>
              Don't have an account? <a onClick={handleSignUpClick}>Sign Up </a>
            </p>
          </div>

          <div className="input-box">
            <input
              type="text"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <IoMailSharp className="icon" />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <IoEyeSharp className="icon" />
          </div>
          <div className="forgot">
            <a href="#">Forgot password</a>
          </div>
          <button type="submit" onClick={onLogin}>
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
