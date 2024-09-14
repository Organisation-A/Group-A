import React, { useEffect } from "react";
import "./BusSchedule.css";
import SideMenu from "../SideMenu/SideMenu";
import SearchBar from "../SearchBar/SearchBar";
import TempMap from "../../TempMap.jsx";
//import { FaRegListAlt } from "react-icons/fa";
//import { IoEyeSharp, IoMailSharp } from "react-icons/io5";
//import { useNavigate } from "react-router-dom";

const Busschedule = () => {
  useEffect(() => {
    // Add class when component mounts
    document.body.classList.add("hide-mapbox-controls");

    // Remove class when component unmounts
    return () => {
      document.body.classList.remove("hide-mapbox-controls");
    };
  }, []);

  const schedule = [
    {
      time: "11:00 AM",
      title: "Circuit bus",
      description: "Body text for route taken by this bus.",
    },
    {
      time: "11:30 AM",
      title: "Reverse circuit bus",
      description: "Body text for route taken by this bus.",
    },
    {
      time: "12:00 PM",
      title: "Junction bus",
      description: "Body text for route taken by this bus.",
    },
    {
      time: "12:30 PM",
      title: "WEC > EOH > Knockando bus",
      description: "Body text for route taken by this bus.",
    },
    {
      time: "1:00 PM",
      title: "Knockando > EOH bus",
      description: "Body text for route taken by this bus.",
    },
    {
      time: "1:30 PM",
      title: "EOH > WEC bus",
      description: "Body text for route taken by this bus.",
    },
  ];

  return (
    <div className="Bus-container">
      <div className="content-container map-back">
        <div className="back">
          <TempMap />
        </div>

        <div className="front">
          <SideMenu />
          <div>
            <SearchBar id="busSearch" />
            <div className="bus-schedule-container">
              <h2>Bus Schedule</h2>
              <div className="schedule">
                {schedule.map((item, index) => (
                  <div className="schedule-item" key={index}>
                    <div className="time">{item.time}</div>
                    <div className="circle"></div>
                    <div className="details">
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Busschedule;
