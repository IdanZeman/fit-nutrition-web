import React, { useState } from 'react';
import { db } from './firebase-config'; // Import Firestore instance
import { doc, setDoc } from 'firebase/firestore'; // Firestore functions
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase-config'; // Import Firebase Auth

const UserDetailsForm = () => {
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    age: '',
    gender: '',
    weeklyRunFrequency: '',
    runningPace: '',
    exerciseTime: '',
    mealFrequency: '',
    coffeeIntake: '',
    weightGoal: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');
    if (!formData.height || !formData.weight || !formData.age || !formData.gender || !formData.coffeeIntake || !formData.exerciseTime
      || !formData.mealFrequency || !formData.runningPace || !formData.weeklyRunFrequency || !formData.weightGoal) {
      setError('All fields are required.');
      setLoading(false);
      return; // Stop the submission if validation fails
    }
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not logged in.');

      // Store data in Firestore
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        ...formData,
        createdAt: new Date(),
        email: user.email,
        displayName: user.displayName,
      });

      // Set success message and redirect to dashboard after delay
      setSuccessMessage('Your profile has been successfully submitted!');
      setTimeout(() => {
        navigate('/dashboard'); // Redirect to dashboard
      }, 2000); // Delay before redirecting (2 seconds)
    } catch (err) {
      console.error('Error saving user data:', err);
      setError('Failed to save data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg"
      >
        <h1 className="text-2xl font-semibold text-center text-blue-600">
          Complete Your Profile
        </h1>
        <div className="mt-4 space-y-4">
          <input
            type="number"
            name="height"
            value={formData.height}
            onChange={handleChange}
            placeholder="Height (cm)"
            required
            className="w-full px-4 py-2 border rounded-md"
          />
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            placeholder="Weight (kg)"
            required
            className="w-full px-4 py-2 border rounded-md"
          />
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Age"
            required
            className="w-full px-4 py-2 border rounded-md"
          />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <input
            type="number"
            name="weeklyRunFrequency"
            value={formData.weeklyRunFrequency}
            onChange={handleChange}
            placeholder="Weekly Run Frequency"
            required
            className="w-full px-4 py-2 border rounded-md"
          />
          <input
            type="text"
            name="runningPace"
            value={formData.runningPace}
            onChange={handleChange}
            placeholder="Running Pace (min/km)"
            required
            className="w-full px-4 py-2 border rounded-md"
          />
          <input
            type="text"
            name="exerciseTime"
            value={formData.exerciseTime}
            onChange={handleChange}
            placeholder="Preferred Exercise Time (e.g., morning)"
            required
            className="w-full px-4 py-2 border rounded-md"
          />
          <input
            type="number"
            name="mealFrequency"
            value={formData.mealFrequency}
            onChange={handleChange}
            placeholder="Daily Meal Frequency"
            required
            className="w-full px-4 py-2 border rounded-md"
          />
          <input
            type="number"
            name="coffeeIntake"
            value={formData.coffeeIntake}
            onChange={handleChange}
            placeholder="Coffee Intake (cups/day)"
            required
            className="w-full px-4 py-2 border rounded-md"
          />
          <input
            type="text"
            name="weightGoal"
            value={formData.weightGoal}
            onChange={handleChange}
            placeholder="Weight Goal (e.g., lose 5kg)"
            required
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        {error && (
          <div className="mt-4 text-red-600 bg-red-100 p-2 rounded-md">
            <p>{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="mt-4 text-green-600 bg-green-100 p-2 rounded-md">
            <p>{successMessage}</p>
          </div>
        )}
        <button
          type="submit"
          className="w-full mt-6 px-6 py-2 text-white font-semibold bg-blue-500 hover:bg-blue-600 rounded-md transition duration-300"
        >
          {loading ? 'Saving...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default UserDetailsForm;
