import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Logout.css";
import SideMenu from "../SideMenu/SideMenu";
import TempMap from "../../TempMap.jsx";
import SearchBar from "../SearchBar/SearchBar";
//import { FaRegListAlt } from "react-icons/fa";
//import { IoEyeSharp, IoMailSharp } from "react-icons/io5";

const Logout = () => {
  useEffect(() => {
    // Add class when component mounts
    document.body.classList.add("hide-mapbox-controls");

    // Remove class when component unmounts
    return () => {
      document.body.classList.remove("hide-mapbox-controls");
    };
  }, []);

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="Logout-container map-back">
      <div className="back">
        <TempMap />
      </div>

      <div className="front">
        <SideMenu />
        <div>
          <SearchBar />
          <div className="logout">
            <p className="question">Departing?</p>
            <button className="yes" onClick={handleLogout}>
              Yes
            </button>
            <button className="No">No</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logout;