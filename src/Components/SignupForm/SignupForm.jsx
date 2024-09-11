import React, { useState } from "react";
import "./SignupForm.css";
import { FaRegListAlt } from "react-icons/fa";
import { IoEyeSharp, IoMailSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { setDoc, doc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, firestore } from "../../utils/firebase";
import Alert from "../Alert/Alert";

const SignUpForm = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleSignUpClick = () => {
    navigate("/");
  };

  const checkPasswordStrength = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return "Password must be at least 8 characters long.";
    }
    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      return "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const passwordError = checkPasswordStrength(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(firestore, "Users", user.uid), {
        firstName: firstName,
        lastName: lastName,
        email: email,
      });

      console.log("Account created successfully");
      setShowAlert(true);

      // Navigate to homepage with state
      navigate("/Homepage", {
        state: { fullName: `${firstName} ${lastName}` },
      });
    } catch (error) {
      console.error(error);
      if (error.code === "auth/email-already-in-use") {
        setError(
          "This email is already registered. Please use a different email."
        );
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email address. Please enter a valid email.");
      } else if (error.code === "auth/weak-password") {
        setError("Password is too weak. Please choose a stronger password.");
      } else {
        setError("An error occurred during signup. Please try again.");
      }
    }
  };

  return (
    <div className="wrapper">
      {showAlert && <Alert message="Account created successfully!" />}
      <div className="wrapper_alpha">
        <form className="SignupForm" onSubmit={handleSubmit}>
          <h1>Welcome to On-Site</h1>
          <div className="register-link">
            <p>
              Already have an account?{" "}
              <button onClick={handleSignUpClick}>Log In </button>
            </p>
          </div>
          <div className="wrapper_beta">
            <div className="input-box-small1">
              <input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <FaRegListAlt className="icon" />
            </div>
            <div className="input-box-small2">
              <input
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
              <FaRegListAlt className="icon" />
            </div>
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
          <button type="submit">Sign up</button>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
