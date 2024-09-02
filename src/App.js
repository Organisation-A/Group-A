import logo from './logo.svg';
import './App.css';
import LoginForm from './Components/LogInForm/LoginForm';
import SigninForm from './Components/SignupForm/SignupForm';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


function App() {
  return (
    <div>
      <Router>
        <Routes>
        <Route path="/" element={<LoginForm/>} />
        <Route path="/sign-up" element={<SigninForm />} />
        </Routes>


      </Router>
    </div>
  );
}

export default App;
