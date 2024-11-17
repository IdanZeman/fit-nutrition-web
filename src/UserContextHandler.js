// UserContextHandler.js
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase-config'; // Import Firebase Auth
import { useNavigate } from 'react-router-dom';

const UserContextHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // If user is not logged in, redirect to SignIn page
        navigate('/Login');
      } else {
        // If user is logged in, you can redirect them to other pages
        // For example, navigate to the UserDetailsForm if new user or dashboard
        navigate('/UserDetailsForm');
      }
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, [navigate]);

  return null; // No UI rendering needed here
};

export default UserContextHandler;
