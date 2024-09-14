import React, { useEffect, useState } from "react";
import "./Alert.css";

const Alert = ({ message, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) return null;

  return (
    <div className="alert-container">
      <div className="alert">{message}</div>
    </div>
  );
};

export default Alert;
