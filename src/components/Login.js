import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import {
    Box,
    Button,
    TextField,
    Typography,
    Container,
} from '@mui/material';
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


const StyledForm = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '400px',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#ffffff', // White background for the form
});

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
        <StyledContainer>
            <StyledForm component="form" onSubmit={handleSubmit}>
                <Typography variant="h4" sx={{ marginBottom: '20px', color: '#27374D' }}>Login</Typography>
                <TextField 
                    variant="outlined"
                    name="username"
                    label="Username"
                    onChange={handleChange}
                    required
                    fullWidth
                    sx={{ marginBottom: '15px' }}
                />
                <TextField 
                    variant="outlined"
                    name="password"
                    label="Password"
                    type="password"
                    onChange={handleChange}
                    required
                    fullWidth
                    sx={{ marginBottom: '20px' }}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Login
                </Button>
                <Typography variant="body1" sx={{ marginTop: '10px' }}>
                    Don't have an account? <a href="/signup">Sign Up</a>
                </Typography>
            </StyledForm>
        </StyledContainer>
    );
};

export default Login;
