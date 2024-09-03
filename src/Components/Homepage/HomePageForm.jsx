import React from 'react';
import './HomePageForm.css'
import SideMenu from '../SideMenu/SideMenu';
import { FaRegListAlt } from "react-icons/fa";
import { IoEyeSharp,IoMailSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const HomepageForm = () => {
    return (
        <div>
          <SideMenu />
          <div className="main-content">
            {/* Your main content here */}
          </div>
        </div>
      );
    };

export default HomepageForm;
