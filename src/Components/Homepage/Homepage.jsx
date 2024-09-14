<<<<<<< HEAD
//Is this file needed?
import React from "react";
import { useNavigate } from "react-router-dom";

=======
import React from "react";
import { useNavigate } from "react-router-dom";


>>>>>>> origin/Gael
function Homepage() {
  const navigate = useNavigate();
  return (
    <div>
<<<<<<< HEAD
      <h1> Main Dashboard </h1>
      <button type="submit" onClick={() => navigate("/")}>
        Sign out
      </button>
=======
        <h1> Main Dashboard </h1>
        <button  type="submit" onClick={() => navigate('/')}>Sign out</button>  
>>>>>>> origin/Gael
    </div>
  );
}

<<<<<<< HEAD
export default Homepage;
=======
export default Homepage;
>>>>>>> origin/Gael
