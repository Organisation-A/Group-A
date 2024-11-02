import React, { useState, useEffect, useCallback } from 'react';
import './EmergencyAlert.css';

const Popup = ({ forceShowPopup = false, forceError = false }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Function to fetch the first alert from the API
  const fetchAlert = async () => {
    try {
      if (forceError) {
        throw new Error('Simulated fetch error');
      }

      const response = await fetch('https://polite-pond-04aadc51e.5.azurestaticapps.net/api/alerts');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      const firstAlert = data[Object.keys(data)[0]];
      setAlertMessage(firstAlert.message);
      setShowPopup(true);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      setAlertMessage("Error fetching emergency alerts.");
      setShowPopup(true);
    }
  };

  const checkTime = useCallback(() => {
    const currentTime = new Date();
    const specificTimes = [
      { hours: 16, minutes: 31 },
      { hours: 6, minutes: 10 }
    ];

    const isPopupTime = specificTimes.some(
      time => time.hours === currentTime.getHours() && time.minutes === currentTime.getMinutes()
    );

    if (isPopupTime) {
      fetchAlert();
    }
  }, [forceError]);

  useEffect(() => {
    if (forceShowPopup) {
      if (forceError) {
        setAlertMessage("Error fetching emergency alerts.");
      } else {
        setAlertMessage("This is a test alert.");
      }
      setShowPopup(true);
    } else {
      const intervalId = setInterval(checkTime, 60000);
      checkTime();
      return () => clearInterval(intervalId);
    }
  }, [checkTime, forceShowPopup, forceError]);

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={closePopup}>&times;</span>
            <h2>Emergency Alert 🚨</h2>
            <p>{alertMessage}</p>
          </div>
        </div>
      )}
    </>
  );
}; 

export default Popup;
