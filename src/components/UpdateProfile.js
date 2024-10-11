import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

const UpdateProfile = () => {
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        firstname: '',
        lastname: '',
        phoneNumber: '',
        birthdate: '',  // Add birthdate field
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                // Convert birthdate to YYYY-MM-DD format if it exists
                const formattedBirthdate = user.birthdate 
                    ? user.birthdate.split('/').reverse().join('-') // Converts dd/MM/yyyy to yyyy-MM-dd
                    : ''; // Set to empty string if no birthdate
                setUserData({ ...user, birthdate: formattedBirthdate }); // Populate the form with user data
            } else {
                console.error('No user data found, user not authenticated.');
                navigate('/login'); // Redirect to login if not authenticated
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

        // Check if the token is available
        if (!token) {
            console.error('No token found. User is not authenticated.');
            navigate('/login'); // Redirect if no token
            return;
        }

        // Ensure the birthdate is in the correct format (YYYY-MM-DD)
        const updatedUserData = {
            ...userData,
            birthdate: userData.birthdate.split('-').reverse().join('/'), // Convert back to dd/MM/yyyy for storage
        };

        console.log('Token being sent:', token);
        console.log('User data being sent:', updatedUserData); // Log user data for debugging

        try {
            const response = await axiosInstance.put('/api/user/update', updatedUserData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Profile updated:', response.data);
            alert('Profile updated successfully!');

            localStorage.setItem('user', JSON.stringify(response.data));
            navigate('/dashboard');
        } catch (error) {
            console.error('Error updating profile:', error.response ? error.response.data : error.message);
            alert('Error updating profile. Please check your credentials and try again.'); // Inform the user of the error
        }
    };

    return (
        <div>
            <h2>Update Profile</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input type="text" name="username" value={userData.username} onChange={handleChange} required />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={userData.email} onChange={handleChange} required />
                </div>
                <div>
                    <label>First Name:</label>
                    <input type="text" name="firstname" value={userData.firstname} onChange={handleChange} required />
                </div>
                <div>
                    <label>Last Name:</label>
                    <input type="text" name="lastname" value={userData.lastname} onChange={handleChange} required />
                </div>
                <div>
                    <label>Phone Number:</label>
                    <input type="text" name="phoneNumber" value={userData.phoneNumber} onChange={handleChange} />
                </div>
                <div>
                    <label>Date of Birth:</label>
                    <input type="date" name="birthdate" value={userData.birthdate} onChange={handleChange} />
                </div>
                <button type="submit">Update Profile</button>
            </form>
        </div>
    );
};

export default UpdateProfile;
