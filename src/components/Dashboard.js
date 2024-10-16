import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { FaUserCircle, FaCog } from 'react-icons/fa';
import {
    Box,
    Button,
    Divider,
    Typography,
    IconButton,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    TextField
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
    backgroundColor: '#DDE6ED',
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
    paddingTop: '0px', // Added padding at the top
}));

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

const Suggestions = styled(Box)(({ theme }) => ({
    width: '20%',
    maxWidth: '250px',
    height: '100vh',
    borderLeft: '1px solid #ccc',
    padding: '20px',
    backgroundColor: '#c3d0d9',
    flexShrink: 0,
    boxShadow: '-2px 0 5px rgba(0, 0, 0, 0.1)',
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

const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const [role, setRole] = useState('');
    const [friends, setFriends] = useState([]);
    const [peopleYouMayKnow, setPeopleYouMayKnow] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null); // For conversation
    const [conversation, setConversation] = useState([]);
    const [newMessage, setNewMessage] = useState(''); // For sending new message
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            const userId = JSON.parse(localStorage.getItem('user'))?.id;

            if (token && userId) {
                try {
                    const response = await axiosInstance.get(`/api/user/id/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setUserData(response.data);
                    setRole(response.data.roles?.[0] || 'Guest');
                    await fetchFriends(userId, token);
                    await fetchPeopleYouMayKnow(userId, token);
                } catch (error) {
                    console.error('Failed to fetch user data:', error.response ? error.response.data : error.message);
                    navigate('/login');
                } finally {
                    setLoading(false);
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
            console.error('Failed to fetch friends:', error.response ? error.response.data : error.message);
        }
    };

    const fetchPeopleYouMayKnow = async (userId, token) => {
        try {
            const response = await axiosInstance.get(`/user-service/api/friend-request/not-friends/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPeopleYouMayKnow(response.data);
        } catch (error) {
            console.error('Failed to fetch people you may know:', error.response ? error.response.data : error.message);
        }
    };

    // Fetch conversation with selected friend
    const fetchConversation = async (friendId) => {
        const token = localStorage.getItem('token');
        const userId = JSON.parse(localStorage.getItem('user'))?.id;
        
        if (token && userId) {
            try {
                const response = await axiosInstance.get(`/api/message/between/${userId}/${friendId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setConversation(response.data);
            } catch (error) {
                console.error('Failed to fetch conversation:', error.response ? error.response.data : error.message);
            }
        }
    };
    // Send new message
    const sendMessage = async () => {
        const token = localStorage.getItem('token');
        const userId = JSON.parse(localStorage.getItem('user'))?.id;

        if (newMessage && selectedFriend) {
            try {
                await axiosInstance.post('/api/message', {
                    senderId: userId, // Include senderId in the body
                    recipientId: selectedFriend.id, // Include recipientId in the body
                    content: newMessage, // Include the message content
                }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setNewMessage(''); // Clear input field after sending
                await fetchConversation(selectedFriend.id); // Update conversation
            } catch (error) {
                console.error('Failed to send message:', error.response ? error.response.data : error.message);
            }
        }
    };



    const toggleSettings = () => {
        setSettingsVisible((prev) => !prev);
    };

    const handleUpdateProfile = () => {
        navigate('/update-profile');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleGoToInvitations = () => {
        navigate('/invitations');
    };

    const handleSendFriendRequest = async (friendId) => {
        const token = localStorage.getItem('token');
        const userId = JSON.parse(localStorage.getItem('user'))?.id;

        if (token && userId) {
            try {
                await axiosInstance.post(`/user-service/api/friend-request/${userId}/${friendId}`, {}, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert('Friend request sent successfully!');
            } catch (error) {
                console.error('Failed to send friend request:', error.response ? error.response.data : error.message);
                alert('Failed to send friend request. Please try again later.');
            }
        }
    };

    const handleFriendClick = (friend) => {
        setSelectedFriend(friend);
        fetchConversation(friend.id); // Fetch conversation when a friend is clicked
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <StyledContainer>
            <Sidebar>
                <div>
                    <SidebarButton onClick={() => navigate('/profile')}>
                        <FaUserCircle size={50} />
                    </SidebarButton>
                    <Typography variant="h5">{userData ? userData.username : 'Guest'}</Typography>
                    <Divider sx={{ margin: '10px 0' }} />

                    <ContentBox sx={{ marginBottom: '5px' }}>
                        <Typography variant="h6" sx={{ color: '#27374D' }}>Friends List</Typography>
                        <List>
                            {friends.length > 0 ? (
                                friends.map((friend) => (
                                    <ListItem 
                                        key={friend.id} 
                                        button 
                                        onClick={() => handleFriendClick(friend)} 
                                        selected={selectedFriend && selectedFriend.id === friend.id}  // Highlight the selected friend
                                    >
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
                <Button 
                    variant="outlined" 
                    color="primary" 
                    onClick={toggleSettings} 
                    sx={{ marginTop: '0px' }} // Adjust margin-top as needed
                >
                    <FaCog /> Settings
                </Button>

                    {settingsVisible && (
                        <div>
                            <Button onClick={handleUpdateProfile}>Update Profile</Button>
                            <Button onClick={handleGoToInvitations}>See Invitations</Button>
                            <Button onClick={handleLogout} color="error">
                                Log out
                            </Button>
                        </div>
                    )}
                </div>
            </Sidebar>

            <MainContent>
                {selectedFriend ? (
                    <Box>
                        <Typography variant="h5">
                            Conversation with {selectedFriend.firstname} {selectedFriend.lastname}
                        </Typography>
                        <List>
                            {conversation.length > 0 ? (
                                conversation.map((msg) => (
                                    <ListItem key={msg.id}>
                                        <ListItemText 
                                            primary={`${msg.senderId === userData?.id ? 'You' : (selectedFriend.firstname || 'Unknown')}: ${msg.content}`} 
                                            secondary={new Date(msg.timestamp).toLocaleString()} 
                                        />
                                    </ListItem>
                                ))
                            ) : (
                                <Typography>No messages yet.</Typography>
                            )}
                        </List>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                            <TextField
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                label="Type a message"
                                fullWidth
                            />
                            <Button onClick={sendMessage} sx={{ ml: 2 }} variant="contained">
                                Send
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    <Typography>Select a friend to start a conversation.</Typography>
                )}
            </MainContent>




            <Suggestions>
                <Typography variant="h6" sx={{ color: '#27374D' }}>People You May Know</Typography>
                <Divider sx={{ margin: '10px 0' }} />
                <List>
                    {peopleYouMayKnow.length > 0 ? (
                        peopleYouMayKnow.map((person) => (
                            <ListItem key={person.id}>
                                <ListItemText primary={`${person.username}`} />
                                <Button 
                                    onClick={() => handleSendFriendRequest(person.id)} 
                                    variant="outlined" 
                                    color="primary"
                                >
                                    Add Friend
                                </Button>
                            </ListItem>
                        ))
                    ) : (
                        <ListItem>
                            <ListItemText primary="No suggestions found." />
                        </ListItem>
                    )}
                </List>
            </Suggestions>
        </StyledContainer>
    );
};

export default Dashboard;
