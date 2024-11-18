import React from 'react';
import { Link } from 'react-router-dom';

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

export default Home;
