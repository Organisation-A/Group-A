import React, { useEffect } from "react";
import "./list.css"
import { useNavigate } from "react-router-dom";
import SideMenu from "../SideMenu/SideMenu";
import TempMap from "../../TempMap.jsx";
import SearchBar from "../SearchBar/SearchBar";
//import { FaRegListAlt } from "react-icons/fa";
//import { IoEyeSharp, IoMailSharp } from "react-icons/io5";

const ListPage = () => {
    const suggestions = [
        "Mathematical Science Laboratories",
        "The Matrix",
        "Solomon Mahlangu",
        "Great Hall",
      ];

  useEffect(() => {
    // Add class when component mounts
    document.body.classList.add("hide-mapbox-controls");

    // Remove class when component unmounts
    return () => {
      document.body.classList.remove("hide-mapbox-controls");
    };
  }, []);

  const navigate = useNavigate();

  const handleLoc = () => {
    navigate("./location1");
  };



  return (
    <div className="list-page">
      <div className="back">
        <TempMap />
      </div>

      <div className="front">
        <SideMenu />
        <div className="co">
        <div>
          <SearchBar />
        </div>
        <ul className="suggestions-list">
        {suggestions.map((item, index) => (
          <li key={index} className="suggestion-item">
            <div> <a onClick={handleLoc}>{item}</a></div>
            <div className="dist">Distance: 100m</div> {/* You can add the distance here */}
          </li>
        ))}
        </ul>
        </div>

      </div>
    </div>
  );
};

export default ListPage;