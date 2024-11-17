import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import './App.css';
import Login from './Login';
import UserDetailsForm from './UserDetailsForm';
import Dashboard from './Dashboard';
import NavBar from './NavBar';

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
    <Router>
      <Routes>
        {/* Pages without NavBar */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        {/* Pages with NavBar */}
        <Route
          path="/userdetailsform"
          element={
            <AppLayout>
              <UserDetailsForm />
            </AppLayout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;

const Home = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-blue-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-600">Welcome to FitNutrition!</h1>
        <p className="mt-4 text-lg">Track your fitness, nutrition, and events all in one place.</p>
        <div className="mt-6">
          <Link to="/login">
            <button className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300">
              Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
