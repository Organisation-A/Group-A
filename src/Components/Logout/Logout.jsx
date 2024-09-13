import React from "react";
import "./Logout.css";
import SideMenu from "../SideMenu/SideMenu";
import TempMap from "../../TempMap.jsx";
import SearchBar from "../SearchBar/SearchBar";
import { FaRegListAlt } from "react-icons/fa";
import { IoEyeSharp, IoMailSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="Logout-container">
      <SideMenu />
      <div className="logout">
        <p className="question">Departing?</p>
        <button className="yes" onClick={handleLogout}>
          Yes
        </button>
        <button className="No">No</button>
      </div>
    </div>
  );
};

export default Logout;
