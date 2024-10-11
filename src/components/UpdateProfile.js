import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Typography,
    TextField,
    Snackbar,
    Alert
} from '@mui/material';
import { styled } from '@mui/system';

const StyledContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    height: '100vh',
    backgroundColor: '#f0f4ff',
});

const FormContainer = styled(Box)({
    width: '100%',
    maxWidth: '600px',
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
});

const UpdateProfile = () => {
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        firstname: '',
        lastname: '',
        phoneNumber: '',
        birthdate: '',
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                const formattedBirthdate = user.birthdate 
                    ? user.birthdate.split('/').reverse().join('-')
                    : '';
                setUserData({ ...user, birthdate: formattedBirthdate });
            } else {
                console.error('No user data found, user not authenticated.');
                navigate('/login');
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (!token) {
            console.error('No token found. User is not authenticated.');
            navigate('/login');
            return;
        }

        const updatedUserData = {
            ...userData,
            birthdate: userData.birthdate.split('-').reverse().join('/'),
        };

        try {
            const response = await axiosInstance.put('/api/user/update', updatedUserData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Profile updated:', response.data);
            setSuccessMessage('Profile updated successfully!');

            localStorage.setItem('user', JSON.stringify(response.data));
            navigate('/dashboard');
        } catch (error) {
            console.error('Error updating profile:', error.response ? error.response.data : error.message);
            setErrorMessage('Error updating profile. Please check your credentials and try again.');
        }
    };

    const handleCloseSnackbar = () => {
        setSuccessMessage('');
        setErrorMessage('');
    };

    return (
        <StyledContainer>
            <FormContainer>
                <Typography variant="h4" textAlign="center" mb={3}>
                    Update Profile
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Username"
                        name="username"
                        value={userData.username}
                        onChange={handleChange}
                        required
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                        required
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="First Name"
                        name="firstname"
                        value={userData.firstname}
                        onChange={handleChange}
                        required
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Last Name"
                        name="lastname"
                        value={userData.lastname}
                        onChange={handleChange}
                        required
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Phone Number"
                        name="phoneNumber"
                        value={userData.phoneNumber}
                        onChange={handleChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Birthdate"
                        type="date"
                        name="birthdate"
                        value={userData.birthdate}
                        onChange={handleChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        margin="normal"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Update Profile
                    </Button>
                </form>
            </FormContainer>
            <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    {successMessage}
                </Alert>
            </Snackbar>
            <Snackbar open={!!errorMessage} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </StyledContainer>
    );
};

export default UpdateProfile;
