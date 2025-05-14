import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import bg from "../assets/hero.png"
import logo from "../assets/logo.png"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    try {
      const response = await axios.post("http://localhost:8000/api/login", {email, password}, 
        {headers: {"Content-Type": "application/json"}})

      if (response.data.success && response.data.access_token) {
        console.log(response)
        // Store token 
        localStorage.setItem("token", response.data.access_token)
        // Redirect to home route
        navigate("/chat/1")
      } else {
        setError("Login failed. Please try again.")
      }
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.detail || "Login failed. Please try again.")
    }
  }

  return (
    <section className='flex items-center justify-center bg-[#222222]'>
      <div className='w-full flex flex-col items-center justify-between px-12 py-5 lg:p-8 lg:px-15 lg:flex-row'>
        <div className='w-full object-contain lg:w-[50%] transform transition-transform duration-700 hover:scale-105'>
          <img src={bg} className='lg:h-120 lg:w-125 rounded-3xl cursor-pointer' alt="" />
        </div>

        <div className='w-full flex flex-col items-start justify-start gap-y-3 lg:gap-y-5 py-5 lg:py-20 lg:w-[50%]'>
          <div className='w-full flex justify-center items-center'>
            <h1 className='text-white text-3xl font-bold flex items-center tracking-wider gap-x-1'>
              AI Chatbot <span><img src={logo} className='h-15 cursor-pointer transform transition-transform duration-200 hover:scale-105' alt="" /></span>
            </h1>
          </div>
          <p className='text-white text-xl font-light'>Log in or sign up to Your Account</p>

          <form onSubmit={handleSubmit} className='flex flex-col items-start w-full'>
            {error && <p className="text-red-500 text-base mb-3">{error}</p>}

            <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} placeholder='Enter Your Email' required className='w-full text-white border border-gray-400 rounded-xl pl-4 pr-10 py-2 mb-5 focus:outline-none focus:border-gray-200'/>

            <input type="password" onChange={(e) => setPassword(e.target.value)} value={password}placeholder='Enter Your Password' required className='w-full text-white border border-gray-400 rounded-xl pl-4 pr-10 py-2 mb-5 focus:outline-none focus:border-gray-200'/>

            <button type="submit" className='w-full text-white border border-gray-400 rounded-xl px-10 py-2 cursor-pointer font-bold hover:bg-[#2d2d2d] text-center'>Login</button>
          </form>

          <div>
            <p className='text-white'>Don't have any account?{' '}
            <Link to='/signup' className='text-blue-500 hover:underline'>Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login
