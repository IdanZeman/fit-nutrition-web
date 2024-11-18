import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase-config'; // Import Firestore instance
import { doc, getDoc, updateDoc } from 'firebase/firestore'; // Firestore functions
import { auth } from '../firebase/firebase-config'; // Import Firebase Auth
import { useNavigate } from 'react-router-dom';

const PersonalInfoPage = () => {
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    age: '',
    gender: '',
    weeklyRunFrequency: '',
    runningPace: '',
    exerciseTime: '',
    coffeeIntake: '',
    weightGoal: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate('/login');
        return;
      }

      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
        setFormData(docSnap.data());
      } else {
        console.log('No such document!');
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert('User not logged in');
      return;
    }

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, formData);
      setUserData(formData);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  // Helper function to format time (min:sec)
  const formatTime = (value) => {
    const minutes = Math.floor(value);
    const seconds = Math.round((value - minutes) * 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center text-blue-600">Your Personal Information</h2>

      <div className="mt-6">
        <div className="flex justify-between items-center">
          <label className="font-medium text-gray-700">Height (cm):</label>
          {editMode ? (
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleInputChange}
              className="border p-2 rounded-md"
            />
          ) : (
            <p>{userData.height} cm</p>
          )}
        </div>

        <div className="flex justify-between items-center mt-4">
          <label className="font-medium text-gray-700">Weight (kg):</label>
          {editMode ? (
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              className="border p-2 rounded-md"
            />
          ) : (
            <p>{userData.weight} kg</p>
          )}
        </div>

        <div className="flex justify-between items-center mt-4">
          <label className="font-medium text-gray-700">Age:</label>
          {editMode ? (
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className="border p-2 rounded-md"
            />
          ) : (
            <p>{userData.age} years</p>
          )}
        </div>

        <div className="flex justify-between items-center mt-4">
          <label className="font-medium text-gray-700">Gender:</label>
          {editMode ? (
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="border p-2 rounded-md"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          ) : (
            <p>{userData.gender}</p>
          )}
        </div>

        <div className="flex justify-between items-center mt-4">
          <label className="font-medium text-gray-700">Weekly Run Frequency:</label>
          {editMode ? (
            <select
              name="weeklyRunFrequency"
              value={formData.weeklyRunFrequency}
              onChange={handleInputChange}
              className="border p-2 rounded-md"
            >
              <option value="0">0</option>
              <option value="1-2">1-2</option>
              <option value="3+">3+</option>
            </select>
          ) : (
            <p>{userData.weeklyRunFrequency}</p>
          )}
        </div>

        <div className="flex justify-between items-center mt-4">
          <label className="font-medium text-gray-700">Running Pace (min/km):</label>
          {editMode ? (
            <div className="flex items-center">
              <input
                type="range"
                name="runningPace"
                value={formData.runningPace}
                onChange={handleInputChange}
                min="4"
                max="10"
                step="0.1"
                className="w-full"
              />
              <span className="ml-4">{formatTime(formData.runningPace)}</span>
            </div>
          ) : (
          <p>{formatTime(userData.runningPace / 60)}</p>
          )}
        </div>

        <div className="flex justify-between items-center mt-4">
          <label className="font-medium text-gray-700">Preferred Exercise Time:</label>
          {editMode ? (
            <select
              name="exerciseTime"
              value={formData.exerciseTime}
              onChange={handleInputChange}
              className="border p-2 rounded-md"
            >
              <option value="morning">Morning</option>
              <option value="noon">Noon</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
            </select>
          ) : (
            <p>{userData.exerciseTime}</p>
          )}
        </div>

        <div className="flex justify-between items-center mt-4">
          <label className="font-medium text-gray-700">Coffee Intake:</label>
          {editMode ? (
            <select
              name="coffeeIntake"
              value={formData.coffeeIntake}
              onChange={handleInputChange}
              className="border p-2 rounded-md"
            >
              <option value="0">0</option>
              <option value="1-2">1-2</option>
              <option value="3-5">3-5</option>
              <option value="5+">5+</option>
            </select>
          ) : (
            <p>{userData.coffeeIntake}</p>
          )}
        </div>

        <div className="flex justify-between items-center mt-4">
          <label className="font-medium text-gray-700">Weight Goal:</label>
          {editMode ? (
            <input
              type="number"
              name="weightGoal"
              value={formData.weightGoal}
              onChange={handleInputChange}
              className="border p-2 rounded-md"
            />
          ) : (
            <p>{userData.weightGoal} kg</p>
          )}
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            type="button"
            onClick={() => setEditMode(!editMode)}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            {editMode ? 'Cancel' : 'Edit'}
          </button>
          {editMode && (
            <button
              type="button"
              onClick={handleUpdate}
              className="bg-green-500 text-white py-2 px-4 rounded"
            >
              Update
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoPage;
