import logo from './logo.svg';
import './App.css';
import LoginForm from './Components/LogInForm/LoginForm';
import SigninForm from './Components/SignupForm/SignupForm';
import HomePageForm from './Components/Homepage/HomePageForm';
import BusSchedule from './Components/BusShedule/BusSchedule';
import Rentals from './Components/Rentals/Rentals';
import Logout from './Components/Logout/Logout';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


function App() {
  return (
    <div>
      <Router>
        <Routes>
        <Route path="/" element={<LoginForm/>} />
        <Route path="/sign-up" element={<SigninForm />} />
        <Route path="/Homepage" element={<HomePageForm />} />
        <Route path="/BusSchedule" element={<BusSchedule />} />
        <Route path="/Rentals" element={<Rentals />} />
        <Route path="/Logout" element={<Logout />} />
        </Routes>


      </Router>
    </div>
  );
}

export default App;
