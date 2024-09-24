import React, { useEffect, useState } from "react";
import "./Profile.css";
import SideMenu from "../SideMenu/SideMenu";
import SearchBar from "../SearchBar/SearchBar";
import { FaUser } from "react-icons/fa";
import TempMap from "../../TempMap.jsx";
import axios from "axios";

const Profile = () => {
  const [buses, setBuses] = useState([]);
  const [fullName, setFullName] = useState("John Doe"); // Default to "John Doe" for now

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
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-picture">
              <FaUser className="ProfileIcon1"/>
              </div>
              <div className="profile-info">
                <h2>Hello</h2>
                <p className="name">{fullName}</p>
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
        </div>
      </div>
    </div>
  );
};

export default Profile;

