import logo from './logo.svg';
import './App.css';
import LoginForm from './Components/LogInForm/LoginForm';
import SigninForm from './Components/SignupForm/SignupForm';
import HomePageForm from './Components/Homepage/HomePageForm';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


function App() {
  return (
    <div>
      <Router>
        <Routes>
        <Route path="/" element={<LoginForm/>} />
        <Route path="/sign-up" element={<SigninForm />} />
        <Route path="/Homepage" element={<HomePageForm />} />
        </Routes>


      </Router>
    </div>
  );
}

export default App;
