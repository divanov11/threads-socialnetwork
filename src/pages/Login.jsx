import React, {useRef, useEffect} from 'react'
import { Link } from 'react-router-dom'
import {useNavigate} from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
    const loginForm = useRef(null)
    const {loginUser, user} = useAuth()

    const navigate = useNavigate()

    useEffect(()=> {
        if(user){
            navigate('/')
        }
    }, [])


    const handleSubmit = async (e) => {
        e.preventDefault()
        
        const email = loginForm.current.email.value
        const password = loginForm.current.password.value

        loginUser({email, password})
        navigate('/')
    }

  return (  
      <div className="container mx-auto max-w-[400px] rounded-md border border-[rgba(49,49,50,1)] p-4">
          <form onSubmit={handleSubmit} ref={loginForm}>
              <div className="py-2">
                  <label>Email:</label>
                  <input 
                  required
                  type="email" 
                  name="email"
                  className="w-full p-2 rounded-sm"
                  />
              </div>

              <div className="py-2">
                  <label>Password:</label>
                  <input 
                  required
                  type="password" 
                  name="password"
                  className="w-full p-2 rounded-sm"
                  />
              </div>

              <div className="py-2">
                  <input 
                  type="submit" 
                  name="Login" 
                  className="bg-white text-black py-2 px-4 border text-sm border-black rounded"/>
              </div>
          </form>

          <p>Don't have an account? <Link to="/register">Register</Link></p>
      </div>
  )
}

export default Login
