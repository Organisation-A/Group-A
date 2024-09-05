import React from 'react';
import { FiMapPin } from "react-icons/fi";  // For FiMapPin
import { GrBus } from "react-icons/gr";    // For GrBus
import { CiRoute, CiLogout } from "react-icons/ci";  // For CiRoute and CiLogout
import './SideMenu.css'; // Import your CSS file
import logo from '../Assets/black_logo.jpg';

const SideMenu = () => {
  return (
    <div className="side-menu">
      <img src={logo} alt="logo" className="logo" />
      <div className="menu-divider"></div> {/* Divider Line */}
  
      <div className="menu-item">
        <span> <FiMapPin className="icon" /></span>
        <span className="menu-text">Home</span>
      </div>
      <div className="menu-item">
        <span><GrBus className="icon" /></span>
        <span className="menu-text">Bus Schedule</span>
      </div>
      <div className="menu-item">
        
        <span><CiRoute className="icon" /></span>
        <span className="menu-text">Rentals</span>
      </div>
      <div className="menu-item">
        
        <span><CiLogout className="icon" /></span>
        <span className="menu-text">Logout</span>
      </div>
    </div>
  );
};

export default SideMenu;
