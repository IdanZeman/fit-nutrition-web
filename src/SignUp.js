import React, { useState } from 'react';
import { auth } from './firebase-config';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const provider = new GoogleAuthProvider(); // Basic Google Auth Provider setup

const SignUp = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(''); // Clear previous errors, if any

      // Sign in with Google using a popup
      await signInWithPopup(auth, provider);
      
      // On successful sign-in, navigate to the dashboard or home
      navigate('/dashboard');
    } catch (err) {
      setError('Error signing in with Google. Please try again.');
      console.error('Google Sign-In Error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-center text-blue-600">Sign In</h1>
        
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleGoogleSignIn}
            className="w-full px-6 py-2 text-white font-semibold bg-red-500 hover:bg-red-600 rounded-md transition duration-300"
          >
            {loading ? 'Signing In with Google...' : 'Sign In with Google'}
          </button>
        </div>

        {error && (
          <div className="mt-4 text-red-600 bg-red-100 p-2 rounded-md">
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;
