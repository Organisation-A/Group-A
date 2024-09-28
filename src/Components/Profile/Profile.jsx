import React, { useEffect, useState } from "react";
import "./Profile.css";
import SideMenu from "../SideMenu/SideMenu";
import SearchBar from "../SearchBar/SearchBar";
import { FaUser } from "react-icons/fa";
import axios from "axios";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth, firestore } from '../../utils/firebase.js';
import { doc, getDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BuildingMap from "../../BuildingMap";

const Profile = () => {
  const [fullName, setFullName] = useState("John Doe"); // Default to "John Doe" for now
  const [email, setEmail] = useState("John@gmail.com"); // Existing email
  const [kudu, setKudu]=useState("")
  const [UID, setUserId] = useState(null);
  const [rental, setRental] = useState([]);
  const [userData, setUserData] = useState(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false); // Toggle password reset form within the card
  const [showPopup, setShowPopup] = useState(false);

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
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, set the user ID
        setUserId(user.uid);
        console.log('User ID:', user.uid);
        // Fetch user document to check if location exists
        const userRef = doc(firestore, 'Users', user.uid);
        getDoc(userRef).then((docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUserData(userData); // Set user's location
            setEmail(userData.email);
            setKudu(userData.kudu)
            setFullName(`${userData.firstName} ${userData.lastName}`);
            console.log('User Data:', userData); // Log the location for debugging
          } else {
            console.log('No such user document!');
          }
        }).catch((error) => {
          console.error('Error fetching user document:', error);
        });
      } else{
        setUserId(null);
        setUserData(null); // Reset user location
        console.log('No user is logged in');
      }
    });
  }, []);

  // Handle password reset
  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      await sendPasswordResetEmail(auth, email); // Use the email stored in state
      toast.success("Password reset email sent! Check your inbox.");
      setShowForgotPassword(false); // Close the form after sending the email
    } catch (error) {
      console.error(error.message);
      toast.error("Error sending password reset email. Please try again.");
    }
  };

  const handleCancel = () => {
    setUserData(null);
  };

  const handleRentClick = () => {
    setShowPopup(true);
  };
  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const getKuduColor = (kudu) => {
    if (kudu >= 70) {
      return 'green';
    } else if (kudu >= 20) {
      return `rgb(${255 - (kudu - 20) * 2}, 255, 0)`; // Gradually decrease red component
    } else {
      return `rgb(255, ${(kudu / 20) * 255}, 0)`; 
    }
  };

  return (
    <div className="Profile-container map-back">
      <div className="back">
        <BuildingMap />
      </div>

      <div className="front">
        <SideMenu />
        <div>
          <SearchBar id="busSearch" />

          {/* Profile Card */}
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-picture">
                <FaUser className="ProfileIcon1" />
              </div>
              <div className="profile-info">
                <h2>Hello</h2>
                <p className="name">{fullName}</p>
                <p className="name">{email}</p>
                {/* Change Password Link */}
                <div className="change">
                  <a href="#" onClick={() => setShowForgotPassword(true)}>
                    Change password
                  </a>
                </div>
                 {/* Profile Stats */}
                <div className="profile-stats">
                  <div className="stat-item">
                    <h3 style={{ color: getKuduColor(kudu) }}>{kudu}</h3>
                    <p>KuduBucks</p>
                  </div>
                  <div className="stat-item">
                    <h3>23</h3>
                    <p>Vehicles Available</p>
                  </div>
                </div>
              </div>
            </div>

            {!showForgotPassword ? (
              <>
                {/* Profile Stats
                <div className="profile-stats">
                  <div className="stat-item">
                    <h3>{kudu}</h3>
                    <p>KuduBucks</p>
                  </div>
                  <div className="stat-item">
                    <h3>23</h3>
                    <p>Vehicles Available</p>
                  </div>
                </div> */}
                <div className="divider"></div>
                <div className="rent-history">
                  <h4>Current Rental</h4>
                  <div className="bicycle-item">
                    <h3>{userData ? userData.item : 'No current rental'}</h3>
                    <p>Location: {userData ? userData.location : 'Unknown'}</p>
                    {/* <button className="cancelBtn">
                      Cancel Rental
                      </button> */}
                    {userData && (
                      <a
                        className="cancel-link"
                        onClick={() => handleRentClick()}
                      >
                        Cancel Rental
                      </a>
                    )}

                  </div>
                  

                </div>
              </>
            ) : (
              <>
                {/* Reset Password Form inside the card */}
                <form onSubmit={handleForgotPassword} className="reset">
                  <h2>Reset Password</h2>
                  <p>A reset link will be sent to your email: {email}</p>
                  <button type="submit" className="btn-">
                    Send Reset Email
                  </button>
                  <br />
                  <br />
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="btn-"
                  >
                    Cancel
                  </button>
                </form>
              </>
            )}

            {showPopup && (
            <div className="popup-overlay">
              <div className="popup-content">
                <h4>Cancel Rental</h4>
                <p>
                  Are you sure you want to cancel this item? <br />
                </p>
                  <button 
                  className="cancelBtn" 
                  // onClick={handleClosePopup}
                    // className="rentBtn" 
                     onClick={handleCancel}
                  >
                    Cancel
                  </button>
                

                <button className="closeBtn" onClick={handleClosePopup}>Close</button>
              </div>
            </div>
          )}
           
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Profile;
