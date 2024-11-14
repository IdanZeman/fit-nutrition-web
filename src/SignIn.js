// src/SignIn.js
import React from 'react';
import { Link } from 'react-router-dom';

const SignIn = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-blue-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-600">Sign In</h1>
        <form className="mt-8">
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              className="px-4 py-2 w-full border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              className="px-4 py-2 w-full border border-gray-300 rounded"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-700 transition duration-300"
          >
            Sign In
          </button>
        </form>
        <p className="mt-4">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
