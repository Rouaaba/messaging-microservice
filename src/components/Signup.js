import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { Box, Button, Typography, TextField } from '@mui/material';
import { styled } from '@mui/system';

const StyledContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  backgroundColor: '#f0f4ff',
  padding: '20px',
});

const FormContainer = styled(Box)({
  backgroundColor: '#ffffff',
  padding: '30px',
  borderRadius: '10px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  width: '100%',
  maxWidth: '400px',
});

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
    role: ['ROLE_USER'],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...formData,
        birthDate: new Date(formData.birthDate).toLocaleDateString('en-GB'),
      };

      await axiosInstance.post('/api/auth/signup', formattedData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      navigate('/login');
    } catch (error) {
      console.error('Signup failed:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <StyledContainer>
      <FormContainer>
        <Typography variant="h4" component="h2" align="center" sx={{ color: '#27374D', marginBottom: '20px' }}>
          Signup
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
            sx={{ marginBottom: '15px' }}
          />
          <TextField
            fullWidth
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
            sx={{ marginBottom: '15px' }}
          />
          <TextField
            fullWidth
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
            sx={{ marginBottom: '15px' }}
          />
          <TextField
            fullWidth
            name="firstName"
            placeholder="First Name"
            onChange={handleChange}
            required
            sx={{ marginBottom: '15px' }}
          />
          <TextField
            fullWidth
            name="lastName"
            placeholder="Last Name"
            onChange={handleChange}
            required
            sx={{ marginBottom: '15px' }}
          />
          <TextField
            fullWidth
            name="birthDate"
            type="date"
            onChange={handleChange}
            required
            sx={{ marginBottom: '15px' }}
          />
          <TextField
            fullWidth
            name="phoneNumber"
            placeholder="Phone Number"
            onChange={handleChange}
            required
            sx={{ marginBottom: '20px' }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Sign Up
          </Button>
        </form>
        <Typography variant="body2" align="center" sx={{ marginTop: '15px' }}>
          Already have an account? <a href="/login">Login</a>
        </Typography>
      </FormContainer>
    </StyledContainer>
  );
};

export default Signup;
