import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    phoneNumber: '',
    role: ['ROLE_USER'], // Include role here
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Format the birthDate to the required format before sending
      const formattedData = {
        ...formData,
        birthDate: new Date(formData.birthDate).toLocaleDateString('en-GB'), // Format to "dd/MM/yyyy"
      };

      await axiosInstance.post('/api/auth/signup', formattedData, {
        headers: {
          'Content-Type': 'application/json', // Ensure the content type is set to JSON
        },
      });

      navigate('/login'); // Redirect to login page
    } catch (error) {
      console.error('Signup failed:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required />
        <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required />
        <input type="date" name="birthDate" onChange={handleChange} required />
        <input type="text" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} required />
        <button type="submit">Sign Up</button>
      </form>
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
};

export default Signup;
