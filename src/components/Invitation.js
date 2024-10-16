import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { FaUserCircle, FaCog, FaArrowLeft } from 'react-icons/fa';
import {
    Box,
    Button,
    Divider,
    Typography,
    IconButton,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import { styled } from '@mui/system';

const StyledContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'row',
    padding: '0',
    margin: '0',
    width: '100vw',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    overflow: 'hidden',
    backgroundColor: '#f0f4ff',
});

const Sidebar = styled(Box)(({ theme }) => ({
    width: '20%',
    maxWidth: '350px',
    height: '100vh',
    borderRight: '1px solid #ccc',
    padding: '20px',
    backgroundColor: '#c3d0d9',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
    [theme.breakpoints.down('sm')]: {
        width: '30%',
    },
    [theme.breakpoints.down('xs')]: {
        display: 'none',
    },
}));

const ContentBox = styled(Box)({
    backgroundColor: '#ffffff',
    padding: '15px',
    borderRadius: '10px',
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
    marginBottom: '10px',
});

const SidebarButton = styled(IconButton)({
    marginBottom: '10px',
});

const MainContent = styled(Box)({
    flexGrow: 1,
    height: '100vh',
    padding: '20px',
    textAlign: 'center',
    backgroundColor: '#ffffff',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    overflowY: 'auto',
    borderRadius: '10px',
    margin: '20px',
});

const InvitationsSection = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
    marginTop: '20px',
});

const InvitationsBox = styled(Box)({
    flex: 1,
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
});

const Invitations = () => {
    const [userData, setUserData] = useState(null);
    const [friends, setFriends] = useState([]);
    const [sentInvitations, setSentInvitations] = useState([]);
    const [receivedInvitations, setReceivedInvitations] = useState([]);
    const [settingsVisible, setSettingsVisible] = useState(false);
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
                    setUserData(response.data);
                    await fetchFriends(userId, token);
                    await fetchReceivedInvitations(userId, token);
                    await fetchSentInvitations(userId, token);
                } catch (error) {
                    console.error('Failed to fetch user data:', error);
                    navigate('/login');
                }
            } else {
                navigate('/login');
            }
        };
        fetchUserData();
    }, [navigate]);

    const fetchFriends = async (userId, token) => {
        try {
            const response = await axiosInstance.get(`/api/user/friends/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFriends(response.data);
        } catch (error) {
            console.error('Failed to fetch friends:', error);
        }
    };

    const fetchReceivedInvitations = async (userId, token) => {
        try {
            const response = await axiosInstance.get(`/user-service/api/friend-request/received/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setReceivedInvitations(response.data);
        } catch (error) {
            console.error('Failed to fetch received invitations:', error);
        }
    };

    const fetchSentInvitations = async (userId, token) => {
        try {
            const response = await axiosInstance.get(`/user-service/api/friend-request/sent/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSentInvitations(response.data);
        } catch (error) {
            console.error('Failed to fetch sent invitations:', error);
        }
    };

    const acceptRequest = async (senderId, token) => {
        const receiverId = userData.id;
        try {
            await axiosInstance.delete(`/user-service/api/friend-request/accept/${senderId}/${receiverId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Friend request accepted!');
            fetchReceivedInvitations(receiverId, token);
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    };

    const rejectRequest = async (senderId, token) => {
        const receiverId = userData.id;
        try {
            await axiosInstance.delete(`/user-service/api/friend-request/reject/${senderId}/${receiverId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Friend request rejected!');
            fetchReceivedInvitations(receiverId, token);
        } catch (error) {
            console.error('Error rejecting friend request:', error);
        }
    };

    const goToProfile = () => {
        navigate(`/profile`);
    };

    const toggleSettings = () => {
        setSettingsVisible((prev) => !prev);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleUpdateProfile = () => {
        navigate('/update-profile');
    };

    const handleGoBack = () => {
        navigate('/dashboard');
    };

    return (
        <StyledContainer>
            <Sidebar>
                <div>
                    <SidebarButton onClick={() => navigate('/profile')}>
                        <FaUserCircle size={50} />
                    </SidebarButton>
                    <Typography variant="h5">{userData ? userData.username : 'Guest'}</Typography>
                    <Divider sx={{ margin: '10px 0' }} />

                    <ContentBox>
                        <Typography variant="h6" sx={{ color: '#27374D' }}>Friends List</Typography>
                        <List>
                            {friends.length > 0 ? (
                                friends.map((friend) => (
                                    <ListItem key={friend.id}>
                                        <ListItemText primary={`${friend.firstname} ${friend.lastname}`} />
                                    </ListItem>
                                ))
                            ) : (
                                <ListItem>
                                    <ListItemText primary="No friends found." />
                                </ListItem>
                            )}
                        </List>
                    </ContentBox>
                </div>

                <div>
                    <SidebarButton onClick={toggleSettings}>
                        <FaCog size={20} />
                    </SidebarButton>

                    {settingsVisible && (
                        <Box>
                            <Button onClick={handleUpdateProfile} variant="outlined" sx={{ marginBottom: '5px' }}>
                                Update Profile
                            </Button>
                            <Button onClick={handleLogout} variant="outlined">
                                Logout
                            </Button>
                        </Box>
                    )}
                </div>
            </Sidebar>

            <MainContent>
                <Button variant="contained" color="primary" startIcon={<FaArrowLeft />} onClick={handleGoBack}>
                    Go Back
                </Button>

                <Typography variant="h4" style={{ marginTop: '20px' }}>Invitations</Typography>

                <InvitationsSection>
                    {/* Received Invitations */}
                    <InvitationsBox>
                        <Typography variant="h6">Received Invitations</Typography>
                        <List>
                            {receivedInvitations.length > 0 ? (
                                receivedInvitations.map((invitation) => (
                                    <ListItem key={invitation.senderId}>
                                        <ListItemText primary={invitation.senderUsername} />
                                        <Button
                                            variant="contained"
                                            color="success"
                                            onClick={() => acceptRequest(invitation.senderId)}
                                        >
                                            Accept
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => rejectRequest(invitation.senderId)}
                                        >
                                            Reject
                                        </Button>
                                    </ListItem>
                                ))
                            ) : (
                                <Typography>No received invitations.</Typography>
                            )}
                        </List>
                    </InvitationsBox>

                    {/* Sent Invitations */}
                    <InvitationsBox>
                        <Typography variant="h6">Sent Invitations</Typography>
                        <List>
                            {sentInvitations.length > 0 ? (
                                sentInvitations.map((invitation) => (
                                    <ListItem key={invitation.receiverId}>
                                        <ListItemText primary={invitation.receiverUsername} />
                                    </ListItem>
                                ))
                            ) : (
                                <Typography>No sent invitations.</Typography>
                            )}
                        </List>
                    </InvitationsBox>
                </InvitationsSection>
            </MainContent>
        </StyledContainer>
    );
};

export default Invitations;
