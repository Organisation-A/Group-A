
//Logo is currently not being used
//import logo from "./Components/Assets/black_logo.jpg";
import "./App.css";
import LoginForm from "./Components/LogInForm/LoginForm";
import SigninForm from "./Components/SignupForm/SignupForm";
import HomePageForm from "./Components/Homepage/HomePageForm";
import BusSchedule from "./Components/BusShedule/BusSchedule";
import Rentals from "./Components/Rentals/Rentals";
import Logout from "./Components/Logout/Logout";
import ListPage  from "./Components/SearchBar/list";
import LabPage from "./Components/SearchBar/location1";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/Signup" element={<SigninForm />} />
        <Route path="/Homepage" element={<HomePageForm />} />
        <Route path="/BusSchedule" element={<BusSchedule />} />
        <Route path="/Rentals" element={<Rentals />} />
        <Route path="/Logout" element={<Logout />} />
        <Route path="/list" element={<ListPage />} />
        <Route path="/location1" element={<LabPage />} />
      </Routes>
    </Router>

  );
}

export default App;
