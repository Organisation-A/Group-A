import React, { useEffect } from "react";
import "./Rentals.css";
import SideMenu from "../SideMenu/SideMenu";
import TempMap from "../../TempMap.jsx";
import SearchBar from "../SearchBar/SearchBar";
//import { FaRegListAlt } from "react-icons/fa";
//import { IoEyeSharp, IoMailSharp } from "react-icons/io5";
//import { useNavigate } from "react-router-dom";

const Rentals = () => {
  useEffect(() => {
    // Add class when component mounts
    document.body.classList.add("hide-mapbox-controls");

    // Remove class when component unmounts
    return () => {
      document.body.classList.remove("hide-mapbox-controls");
    };
  }, []);
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
      <div className="map-back">
        <div className="back">
          <TempMap />
        </div>

        <div className="front">
          <dir>
            <SearchBar />
            <div className="bicycle-list" id="rentalsWidth">
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
          </dir>
        </div>
      </div>
    </div>
  );
};

export default Rentals;
