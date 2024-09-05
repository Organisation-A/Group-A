import React from 'react';
import './HomePageForm.css';
import SideMenu from '../SideMenu/SideMenu';
import SearchBar from '../SearchBar/SearchBar';
import { FaRegListAlt } from "react-icons/fa";
import { IoEyeSharp,IoMailSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const HomepageForm = () => {
  return (
    <div className="homepage-container">
      <SideMenu />
      <div className="content-container">
        <SearchBar />
      </div>
    </div>
  );
};

export default HomepageForm;
