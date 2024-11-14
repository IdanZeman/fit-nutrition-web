// src/App.js
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';  // Add Link here
import './App.css';
import SignIn from './SignIn';
import SignUp from './SignUp';

const Home = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-blue-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-600">Welcome to FitNutrition!</h1>
        <p className="mt-4 text-lg">Track your fitness, nutrition, and events all in one place.</p>
        <div className="mt-8">
          <Link
            to="/signin"
            className="px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-700 transition duration-300"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="ml-4 px-6 py-2 text-white bg-green-500 rounded hover:bg-green-700 transition duration-300"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
};

export default App;
