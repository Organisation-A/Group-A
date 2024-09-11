import React, { useState } from "react";
import "./LoginForm.css";
import { IoEyeSharp, IoMailSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "../../utils/firebase";
import Alert from "../Alert/Alert";

const LoginForm = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleSignUpClick = () => {
    navigate("/Signup");
  };

  const onLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Login successful!");

      // Fetch user details from Firestore
      const userDoc = await getDoc(
        doc(firestore, "Users", userCredential.user.uid)
      );
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const fullName = `${userData.firstName} ${userData.lastName}`;

        // Show alert
        setShowAlert(true);

        // Navigate to homepage with state
        navigate("/Homepage", { state: { fullName } });
      } else {
        console.error("User document not found");
        setError("User details not found. Please contact support.");
      }
    } catch (error) {
      console.error(error.message);
      if (error.code === "auth/invalid-credential") {
        setError(
          "Invalid email or password. Please check your credentials and try again."
        );
      } else if (error.code === "auth/user-disabled") {
        setError("This account has been disabled. Please contact support.");
      } else if (error.code === "auth/too-many-requests") {
        setError("Too many failed login attempts. Please try again later.");
      } else {
        setError("An error occurred during login. Please try again.");
      }
    }
  };

  return (
    <div className="wrapper">
      {showAlert && <Alert message="Login successful!" />}
      <div className="wrapper_alpha">
        <form onSubmit={onLogin}>
          <h1>Welcome to On-Site</h1>
          <div className="register-link">
            <p>
              Don't have an account?{" "}
              <button onClick={handleSignUpClick}>Sign Up </button>
            </p>
          </div>
          <div className="input-box">
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <IoMailSharp className="icon" />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <IoEyeSharp className="icon" />
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="forgot">
            <button href="#">Forgot password</button>
          </div>
          <button type="submit">Sign in</button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
