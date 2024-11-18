import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './styles/App.css';
import Login from './components/Login';
import UserDetailsForm from './components/UserDetailsForm';
import Dashboard from './components/Dashboard';
import NavBar from './components/NavBar';
import Home from './components/Home';
import { auth } from './firebase/firebase-config';
import PersonalInfoPage from './components/PersonalInfoPage'; // Import PersonalInfoPage
import PrivateRoute from './components/PrivateRoute'; // Import PrivateRoute

const App = () => {
  const [userName, setUserName] = useState(''); // Lifted state for username

  // Simulate login and save username
  const handleLogin = (name) => {
    console.log('User logged in:', name);
    setUserName(name); // Save username
  };

  // Layout wrapper to include the NavBar
  const AppLayout = ({ children }) => {
    const navigate = useNavigate(); // Initialize the navigate hook

    // Simulate logout and redirect to home
    const handleLogout = () => {
      auth.signOut();
      console.log('User logged out');
      setUserName(''); // Clear username
      navigate('/'); // Redirect to home page after logout
    };

    return (
      <div className="flex">
        <NavBar userName={userName} onLogout={handleLogout} />
        <div className="flex-1">{children}</div>
      </div>
    );
  };

  return (
    <Router>  {/* Ensure the Router wraps the entire app */}
      <Routes>
        {/* Pages without NavBar */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        {/* Protected Routes with NavBar */}
        <Route
          path="/userdetailsform"
          element={
            <PrivateRoute
              element={
                <AppLayout>
                  <UserDetailsForm />
                </AppLayout>
              }
            />
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute
              element={
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              }
            />
          }
        />
        <Route
          path="/personalInfoPage"
          element={
            <PrivateRoute
              element={
                <AppLayout>
                  <PersonalInfoPage />
                </AppLayout>
              }
            />
          }
        />
      </Routes>      
    </Router>
  );
};

export default App;
