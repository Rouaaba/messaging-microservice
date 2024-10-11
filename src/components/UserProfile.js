import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // Initialize loading state
  const navigate = useNavigate(); // Initialize navigate function

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
          setUserData(fetchedUserData); // Set the fetched user data in the state

          // Update user data in localStorage
          localStorage.setItem('user', JSON.stringify(fetchedUserData)); 
        } catch (error) {
          console.error('Failed to fetch user data:', error.response ? error.response.data : error.message);
          navigate('/login'); // Redirect to login if not authenticated or error
        } finally {
          setLoading(false); // Set loading to false after fetching
        }
      } else {
        console.error('No user data found, redirecting to login.');
        navigate('/login'); // Redirect if no user data found
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <div>
      <h2>User Profile</h2>
      {loading ? (
        <p>Loading user data...</p>
      ) : userData ? (
        <div>
          <p>Username: {userData.username}</p>
          <p>Email: {userData.email}</p>
          <p>Full Name: {userData.firstname} {userData.lastname}</p>
          <p>Phone Number: {userData.phoneNumber}</p>
          <p>Bio: {userData.bio}</p>
        </div>
      ) : (
        <p>No user data available.</p>
      )}
    </div>
  );
};

export default UserProfile;
