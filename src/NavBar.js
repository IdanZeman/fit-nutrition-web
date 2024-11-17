import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = ({ userName, onLogout }) => {
  return (
    <div className="h-screen w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4 text-center">
        <h2 className="text-lg font-semibold">FitNutrition</h2>
        {userName ? <p className="mt-2">Hello, {userName}</p> : <p>Welcome, Guest</p>}
      </div>

      <nav className="mt-8 flex-1">
        <ul className="space-y-4">
          <li>
            <Link
              to="/dashboard"
              className="block px-4 py-2 hover:bg-gray-700 rounded"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/userdetailsform"
              className="block px-4 py-2 hover:bg-gray-700 rounded"
            >
              Personal Details
            </Link>
          </li>
          <li>
            <Link
              to="/settings"
              className="block px-4 py-2 hover:bg-gray-700 rounded"
            >
              Settings
            </Link>
          </li>
        </ul>
      </nav>

      {userName && (
        <button
          onClick={onLogout}
          className="m-4 px-4 py-2 bg-red-500 hover:bg-red-700 rounded"
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default NavBar;
