// src/SignUp.js
import React from 'react';
import { Link } from 'react-router-dom';

const SignUp = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-blue-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-600">Sign Up</h1>
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
          <div className="mb-4">
            <input
              type="password"
              placeholder="Confirm Password"
              className="px-4 py-2 w-full border border-gray-300 rounded"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 text-white bg-green-500 rounded hover:bg-green-700 transition duration-300"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4">
          Already have an account?{' '}
          <Link to="/signin" className="text-blue-500 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
