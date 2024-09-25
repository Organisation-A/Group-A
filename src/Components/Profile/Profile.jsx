import React, { useEffect, useState } from "react";
import "./Profile.css";
import SideMenu from "../SideMenu/SideMenu";
import SearchBar from "../SearchBar/SearchBar";
import { FaUser } from "react-icons/fa";
import TempMap from "../../TempMap.jsx";
import axios from "axios";
import {
  sendPasswordResetEmail,
} from "firebase/auth";
import { IoEyeSharp, IoEyeOffSharp, IoMailSharp } from "react-icons/io5";
import auth from "../../utils/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const [buses, setBuses] = useState([]);
  const [fullName, setFullName] = useState("John Doe"); // Default to "John Doe" for now
  const [email, setEmail] = useState("JohnDoe@gmail.com");
  const [resetEmail] = useState(email); // For resetting password
  const [showForgotPassword, setShowForgotPassword] = useState(false); // Toggle between profile and forgot password 
  useEffect(() => {
    // Add class when component mounts
    document.body.classList.add("hide-mapbox-controls");

    // Remove class when component unmounts
    return () => {
      document.body.classList.remove("hide-mapbox-controls");
    };
  }, []);

  // Get data
  useEffect(() => {
    // Fetch data from your API
    axios
      .get("https://campus-transport.azurewebsites.net/getSchedule")
      .then((response) => {
        setBuses(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);


  // Handle password reset
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent! Check your inbox.");
      setShowForgotPassword(false); // Close the forgot password form
    } catch (error) {
      console.error(error.message);
      toast.error("Error sending password reset email. Please try again.");
    }
  };

  return (
    <div className="Profile-container">
      <div className="content-container map-back">
        <div className="back">
          <TempMap />
        </div>

        <div className="front">
          <SideMenu />
          <div>
            <SearchBar id="busSearch" />
          </div>
        
          {/* Profile Card */}
          {!showForgotPassword ? (
          <form action="">

          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-picture">
              <FaUser className="ProfileIcon1"/>
              </div>
              <div className="profile-info">
                <h2>Hello</h2>
                <p className="name">{fullName}</p>
                <p classname="email">{email}</p>
                <div className="change">
                  <a href="#" onClick={() => setShowForgotPassword(true)}>
                    Change password
                  </a>
                </div>
                <div className="progress-container">
                  <div className="progress-bar">
                    <div className="progress" style={{ width: '60%' }}></div>
                  </div>
                  <span><p className="credits">40/60 KuduBucks</p></span>
                </div>
              </div>
            </div>
            <div className="profile-stats">
              <div className="stat-item">
                <h3>2</h3>
                <p>Rented vehicles</p>
              </div>
              <div className="stat-item">
                <h3>40</h3>
                <p>KuduBucks</p>
              </div>
              <div className="stat-item">
                <h3>23</h3>
                <p>Vehicles Available</p>
              </div>
            </div>
            <div className="divider"></div>
            <div className="rent-history">
              <h4>Rent History</h4>
              <p className="rentinfo">24/09/2024 - Rented a bicycle(BikeID) at FNB</p>
              <p className="rentinfo">24/09/2024 - Rented a bicycle at FNB</p>
              <p className="rentinfo">24/09/2024 - Rented a bicycle at FNB</p>
            </div>
          </div>
          </form>
            ) : (
          <form onSubmit={handleForgotPassword}>
            <h1>Reset Password</h1>
            <p>A reset link will be sent to your email.</p>

            <button type="submit">Send Reset Email</button>
            <br />
            <br />
            <button type="button" onClick={() => setShowForgotPassword(false)}>
              Cancel
            </button>
        </form>
      )}
      <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default Profile;

