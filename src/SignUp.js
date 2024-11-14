import React, { useState } from 'react';
import { auth } from './firebase-config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading state
    setError(''); // Clear previous errors

    try {
      // Create a new user
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/dashboard'); // Redirect to the dashboard or home page after successful sign up
    } catch (err) {
      console.error('Sign Up Error: ', err.code, err.message); // Log error code and message

      // Custom error message based on Firebase error code
      if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters long.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('This email is already in use. Please try logging in.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address. Please provide a valid email.');
      } else {
        setError('Error creating account. Please try again.');
      }
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-center text-blue-600">Sign Up</h1>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 mt-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 mt-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="mt-4 text-red-600 bg-red-100 p-2 rounded-md">
              <p>{error}</p>
            </div>
          )}

          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              className={`w-full px-6 py-2 text-white font-semibold rounded-md ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-700'
              } transition duration-300`}
              disabled={loading}
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <p>
            Already have an account?{' '}
            <a href="/signin" className="text-blue-500 hover:text-blue-700">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
