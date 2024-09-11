import React, { useState } from "react";
import "./SignupForm.css";
import { FaRegListAlt } from "react-icons/fa";
import { IoEyeSharp, IoMailSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { setDoc, doc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import auth from "../../utils/firebase";

const db = getFirestore();

const SignUpForm = () => {
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate("/");
  };

  // Text-Field variables
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create a new user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Send email verification
      // await sendEmailVerification(userCredential.user);

      // Get user details from the userCredential
      const user = userCredential.user;

      // Add the user's details to Firestore
      await setDoc(doc(db, "Users", user.uid), {
        firstName: firstName,
        lastName: lastName,
        email: email,
      });

      console.log("Account created successfully");
      handleSignUpClick();
    } catch (error) {
      // Handle any errors that may occur during signup
      console.log(error);
    }
  };

  return (
    <div className="wrapper">
      <div className="wrapper_alpha">
        <form className="SignupForm" onSubmit={handleSubmit}>
          <h1>Welcome to On-Site</h1>
          <div className="register-link">
            <p>
              Already have an account?{" "}
              <a onClick={handleSignUpClick}>Log In </a>
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
          <button type="submit">Sign in</button>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
