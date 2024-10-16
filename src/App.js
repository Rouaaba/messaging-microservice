import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import UserProfile from './components/UserProfile';
import UpdateProfile from './components/UpdateProfile';
import Invitations from './components/Invitation';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/update-profile" element={<UpdateProfile />} />
        <Route path="/invitations" element={<Invitations />} />
        <Route path="/" element={<Login />} /> {/* Redirect to login if at root */}
      </Routes>
    </Router>
  );
};

export default App;
