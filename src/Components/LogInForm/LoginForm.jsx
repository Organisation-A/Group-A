import React from 'react';
import './LoginForm.css'
import { FaRegListAlt } from "react-icons/fa";
import { IoEyeSharp,IoMailSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import logo from '../Assets/white_logo.jpg';

const LoginForm = () => {

    const navigate = useNavigate();

    const handleSignUpClick = () => {
      navigate('/sign-up');
    };

    return (
        <div className = 'wrapper'>
            <img></img>
            <div className = 'wrapper_alpha'>
            {/* <img src={logo} alt="Site Logo" className="logo" /> */}
            <form action=''>
                <h1>Welcome to On-Site</h1>
                <div className='register-link'>
                    <p>Don't have an account? <a onClick={handleSignUpClick}>Sign Up </a></p>
                </div>

                <div className='input-box'>
                    <input type="text" placeholder='Email' required/>
                    <IoMailSharp className='icon' />
                </div>
                <div className='input-box'>
                    <input type="password" placeholder='Password' required/>
                    <IoEyeSharp className='icon' />

                </div>
                <div className='forgot'>
                    <a href='#'>Forgot password</a>
                </div>
                <button  type="submit">Sign in</button>
            </form>

        </div>
        </div>
        
    );
};

export default LoginForm;