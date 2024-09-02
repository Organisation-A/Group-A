import React from 'react';
import './SignupForm.css'
import { FaRegListAlt } from "react-icons/fa";
import { IoEyeSharp,IoMailSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {

    const navigate = useNavigate();

    const handleSignUpClick = () => {
      navigate('/');
    };

    return (
        <div className = 'wrapper'>
            <div className = 'wrapper_alpha'>
            <form action=''>
                <h1>Welcome to On-Site</h1>
                <div className='register-link'>
                <p>Already have an account? <a onClick={handleSignUpClick}>Log In </a></p>
                </div>

                <div className = 'wrapper_beta'>
                <div className='input-box-small1'>
                    <input type="text" placeholder='First name' required/>
                    <FaRegListAlt className='icon' />
                </div>

                <div className='input-box-small2'>
                    <input type="text" placeholder='Last name' required/>
                    <FaRegListAlt className='icon' />
                </div>
                
                </div>

                <div className='input-box'>
                    <input type="text" placeholder='Email' required/>
                    <IoMailSharp className='icon' />
                </div>
                <div className='input-box'>
                    <input type="password" placeholder='Password' required/>
                    <IoEyeSharp className='icon' />

                </div>
                <button  type="submit">Sign in</button>
            </form>

        </div>
        </div>
        
    );
};

export default LoginForm;