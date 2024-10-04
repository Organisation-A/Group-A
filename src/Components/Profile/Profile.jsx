import React, { useEffect, useState } from "react";
import "./Profile.css";
import SideMenu from "../SideMenu/SideMenu";
// import SearchBar from "../SearchBar/SearchBar";
import { FaUser } from "react-icons/fa";
import axios from "axios";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth} from '../../utils/firebase.js';
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import BuildingMap from "../Map/BuildingMap";
import { useUserData } from '../../utils/userDataUtils.js';

const Profile = () => {

  const navigate = useNavigate();
  const handleHOME = () => {
    navigate("/Homepage");
  };

  const { userData, userId, refetchUserData } = useUserData(); // Reuse userData and userId
  const [rentalCancelled, setRentalCancelled] = useState(false);

  // console.log("ID: ", userId);

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

  // Handle password reset
  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      await sendPasswordResetEmail(auth, userData.email); // Use the email stored in state
      toast.success("Password reset email sent! Check your inbox.");
      setShowForgotPassword(false); // Close the form after sending the email
    } catch (error) {
      toast.error("Error sending password reset email. Please try again.");
    }
  };
  
  // Handle Rent button click
  const cancelRent = (ritem) => {
    axios
      .post(`https://api-campus-transport.vercel.app/cancel-rent/${userId}/${ritem}`)
      .then(() => {
        handleHOME();
        
        alert("Rental cancellation successful!");
        sessionStorage.removeItem("userData");

        // Reset rentalCancelled after refetch
        setRentalCancelled(true);
        refetchUserData(); // Trigger a refetch of the user data after cancelation
      })
      .catch((error) => {
        console.error("Error canceling rental:", error);
      });
  };

  // Perform only one fetch, and make operations using the session storage data, instead of fetching from firestore
  useEffect(() => {
    // If rentalCancelled is true, refetch user data
    if (rentalCancelled) {
      refetchUserData();
      setRentalCancelled(false); // Reset after refetching
    }
  }, [rentalCancelled, refetchUserData]);


  // const handleCancel = () => {
  //   setUserData(null);
  // };

  // const handleRentClick = () => {
  //   setShowPopup(true);
  // };

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
          {/* <SearchBar id="busSearch" /> */}

          {/* Profile Card */}
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-picture">
                <FaUser className="ProfileIcon1" />
              </div>
              <div className="profile-info">
                <h2>Hello</h2>
                <p className="name">{userData.lastName}</p>
                <p className="name">{userData.email}</p>
                {/* Change Password Link */}
                <div className="change">
                  <a href="#" onClick={() => setShowForgotPassword(true)}>
                    Change password
                  </a>
                </div>
              </div>
              <div className="profile-stats">
                  <div className="stat-item">
                    <h3 style={{ color: getKuduColor(userData.kudu) }}>{userData.kudu}</h3>
                    <p>KuduBucks</p>
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
                    <h3>{userData && userData.item ? userData.item : 'No current rental'}</h3>
                    <p>
                      Pickup: {userData && userData.location ? userData.location : 'No pickup available'}
                    </p>

                    {/* Only show the cancel button if the user has a current rental */}
                    {/* {userData && userData.item && userData.location && (
                      <a
                        className="cancel-link"
                        onClick={() => cancelRent(userData.item)}
                      >
                        Cancel Rental
                      </a>
                    )} */}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Reset Password Form inside the card */}
                <form onSubmit={handleForgotPassword} className="reset">
                  <h2>Reset Password</h2>
                  <p>A reset link will be sent to your email: {userData.email}</p>
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
                  {/* <button 
                  className="cancelBtn" 
                  // onClick={handleClosePopup}
                    // className="rentBtn" 
                     onClick={handleCancel}
                  >
                    Cancel
                  </button> */}
                

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