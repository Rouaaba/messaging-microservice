import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        console.log('Sending request with credentials:', credentials); // Log credentials
        const response = await axiosInstance.post('/api/auth/signin', credentials);
        // Store the entire user data in local storage
        localStorage.setItem('user', JSON.stringify(response.data)); // Store user data object
        localStorage.setItem('token', response.data.token); // Store the token separately if needed
        navigate('/dashboard'); // Redirect to dashboard
    } catch (error) {
        let errorMessage = 'Login failed. Please try again.';
        if (error.response) {
            console.error('Error data:', error.response.data);
            console.error('Error status:', error.response.status);
            errorMessage = error.response.data.message || errorMessage; // Adjust based on your API error response
        } else {
            console.error('Login failed:', error.message);
        }
        alert(errorMessage); // Show error message to user
    }
};


  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="username" 
          placeholder="Username" 
          onChange={handleChange} 
          required 
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          onChange={handleChange} 
          required 
        />
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <a href="/signup">Sign Up</a></p>
    </div>
  );
};

export default Login;
