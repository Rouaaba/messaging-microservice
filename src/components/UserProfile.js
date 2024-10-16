import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import {
    Box,
    Typography,
    CircularProgress,
    Paper,
    Button,
} from '@mui/material';
import { styled } from '@mui/system';

const StyledContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#e3f2fd', // Light blue background
    minHeight: '100vh',
});

const ProfilePaper = styled(Paper)({
    padding: '20px',
    margin: '20px',
    width: '100%',
    maxWidth: '600px',
    borderRadius: '10px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#bbdefb', // Medium blue for profile card
});

const UserProfile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            const userId = JSON.parse(localStorage.getItem('user'))?.id;

            if (token && userId) {
                try {
                    const response = await axiosInstance.get(`/api/user/id/${userId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const fetchedUserData = response.data;
                    setUserData(fetchedUserData);
                    localStorage.setItem('user', JSON.stringify(fetchedUserData));
                } catch (error) {
                    console.error('Failed to fetch user data:', error.response ? error.response.data : error.message);
                    navigate('/login');
                } finally {
                    setLoading(false);
                }
            } else {
                console.error('No user data found, redirecting to login.');
                navigate('/login');
            }
        };

        fetchUserData();
    }, [navigate]);

    return (
        <StyledContainer>
            <Typography variant="h4" sx={{ marginBottom: '20px', color: '#0D47A1' }}>
                User Profile
            </Typography>
            {loading ? (
                <CircularProgress color="primary" />
            ) : userData ? (
                <ProfilePaper elevation={3}>
                    <Typography variant="h6" sx={{ color: '#0D47A1' }}>
                        Username: {userData.username}
                    </Typography>
                    <Typography variant="body1">
                        Email: {userData.email}
                    </Typography>
                    <Typography variant="body1">
                        Full Name: {userData.firstname} {userData.lastname}
                    </Typography>
                    <Typography variant="body1">
                        Phone Number: {userData.phoneNumber}
                    </Typography>
                    <Typography variant="body1">
                        Date Of Birth: {userData.birthdate}
                    </Typography>
                    <Typography variant="body1">
                        Bio: {userData.bio}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ marginTop: '20px' }}
                        onClick={() => navigate('/update-profile')}
                    >
                        Update Profile
                    </Button>
                </ProfilePaper>
            ) : (
                <Typography variant="body1" color="error">
                    No user data available.
                </Typography>
            )}
        </StyledContainer>
    );
};

export default UserProfile;
