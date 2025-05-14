import React, { useEffect, useState } from 'react';
import axios from 'axios';
import logo from "../assets/logo.png";
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../App.css';

const Register = () => {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(''); // ✅ Success message state

    useEffect(() => {
      if (success) {
          const timer = setTimeout(() => {
              setSuccess('');
          }, 5000);
          return () => clearTimeout(timer);
      }
  }, [success]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userName || !email || !password) {
            setError('All fields are required.');
            return;
        }

        const userData = {
            user_name: userName,
            email: email,
            password: password,
        };

        try {
            const response = await axios.post('http://localhost:8000/api/signup', userData, {
                headers: {'Content-Type': 'application/json',},});

            if (response.data.success) {
                setSuccess('Account created successfully! You can now log in.');
                setError('');
                setUserName('');
                setEmail('');
                setPassword('');
            } else {
                setError(response.data.detail || 'Something went wrong. Please try again.');
                setSuccess('');
            }
        } catch (err: any) {
            console.error(err);
            setSuccess('');
            if (err.response && err.response.data) {
                setError(err.response.data.detail || 'Signup failed.');
            } else {
                setError('Failed to connect to the server. Please try again.');
            }
        }
    };

    return (
        <section className='flex items-center justify-center bg-[#222222] py-14 lg:h-screen'>
            <div className='relative max-lg:h-screen lg:border lg:border-gray-600 lg:rounded-xl lg:shadow-md py-2 px-10 lg:py-15 lg:px-10 flex flex-col items-center gap-y-5 lg:w-[50%]'>
                <div>
                    <img src={logo} className='lg:absolute left-0 top-3 h-30 scale-outward' alt="logo" />
                </div>
                <h1 className='text-white text-3xl font-bold tracking-wider'>AI Chatbot</h1>
                <h3 className='text-white text-xl font-light'>Register Your Account</h3>

                {success && (<motion.p className="text-green-500 text-base mb-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>{success}</motion.p>)}

                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <input required value={userName} onChange={(e) => setUserName(e.target.value)} 
                    type="text" placeholder='Enter User Name' className='w-full text-white border border-gray-400 rounded-xl pl-4 pr-10 py-2 mb-5 focus:outline-none focus:border-gray-200'/>
                    
                    <input required value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder='Enter Your Email'className='w-full text-white border border-gray-400 rounded-xl pl-4 pr-10 py-2 mb-5 focus:outline-none focus:border-gray-200'/>

                    <input required value={password} onChange={(e) => setPassword(e.target.value)}type="password" placeholder='Enter Your Password' className='w-full text-white border border-gray-400 rounded-xl pl-4 pr-10 py-2 mb-5 focus:outline-none focus:border-gray-200'/>

                    <button type="submit" className='w-full text-white border border-gray-400 rounded-xl px-10 py-2 cursor-pointer font-bold hover:bg-[#2d2d2d] text-center'>Sign Up</button>
                </form>

                <div>
                    <p className='text-white mt-3'>Already have an account?{' '}
                        <span>
                            <Link to='/login' className='text-blue-500 hover:underline'>Login</Link>
                        </span>
                    </p>
                </div>
                toast("Event has been created.")

            </div>
        </section>
    );
};

export default Register;
