import React from "react";
import "./Rentals.css";
import SideMenu from "../SideMenu/SideMenu";
import TempMap from "../../TempMap.jsx";
import SearchBar from "../SearchBar/SearchBar";
import { FaRegListAlt } from "react-icons/fa";
import { IoEyeSharp, IoMailSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Rentals = () => {
  const bicycles = [
    {
      name: "Bicycle A",
      location: "OLS",
      availability: "10/20",
      distance: "5m",
    },
    {
      name: "Bicycle B",
      location: "FNB",
      availability: "10/20",
      distance: "50m",
    },
    {
      name: "Bicycle C",
      location: "Wits sports hall",
      availability: "10/20",
      distance: "100m",
    },
    {
      name: "Bicycle D",
      location: "NCB",
      availability: "10/20",
      distance: "150m",
    },
    {
      name: "Bicycle E",
      location: "NCB",
      availability: "10/20",
      distance: "200m",
    },
  ];

  return (
    <div className="rentals-container">
      <SideMenu />
      <div className="bicycle-list">
        <input type="text" placeholder="e.g Bicycle" className="search-bar" />
        {bicycles.map((bike, index) => (
          <div className="bicycle-item" key={index}>
            <h3>{bike.name}</h3>
            <p>
              Location: {bike.location} Availability: {bike.availability}
            </p>
            <p>Distance: {bike.distance}</p>
            <a href="#" className="rent-link">
              Rent
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rentals;
