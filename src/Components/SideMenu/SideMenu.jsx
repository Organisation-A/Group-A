import React from 'react';
import { FiMapPin } from "react-icons/fi";  // For FiMapPin
import { GrBus } from "react-icons/gr";    // For GrBus
import { CiRoute, CiLogout } from "react-icons/ci";  // For CiRoute and CiLogout
import './SideMenu.css'; // Import your CSS file

const SideMenu = () => {
  return (
    <div className="side-menu">
      <div className="menu-item">
      <FiMapPin className='icon'/>
        <span className="menu-text">Home</span>
      </div>
      <div className="menu-item">
        <GrBus className='icon'/>
        <span className="menu-text">Bus Schedule</span>
      </div>
      <div className="menu-item">
        <CiRoute className='icon'/>
        <span className="menu-text">Rentals</span>
      </div>
      <div className="menu-item">
        <CiLogout className='icon'/>
        <span className="menu-text">Logout</span>
      </div>
    </div>
  );
};

export default SideMenu;
