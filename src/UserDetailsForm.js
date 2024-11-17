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
  const [currentStep, setCurrentStep] = useState(0); // Track current step
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const questions = [
    { name: 'height', label: 'Height (cm)', type: 'number' },
    { name: 'weight', label: 'Weight (kg)', type: 'number' },
    { name: 'age', label: 'Age', type: 'number' },
    { name: 'gender', label: 'Gender', type: 'select', options: ['male', 'female'] },
    { name: 'weeklyRunFrequency', label: 'Weekly Run Frequency', type: 'number' },
    { name: 'runningPace', label: 'Running Pace (min/km)', type: 'text' },
    { name: 'exerciseTime', label: 'Preferred Exercise Time (e.g., morning)', type: 'text' },
    { name: 'mealFrequency', label: 'Daily Meal Frequency', type: 'number' },
    { name: 'coffeeIntake', label: 'Coffee Intake (cups/day)', type: 'number' },
    { name: 'weightGoal', label: 'Weight Goal (e.g., lose 5kg)', type: 'text' },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (formData[questions[currentStep].name] === '') {
      setError('Please answer the question before moving on.');
      return;
    }
    setError('');
    setCurrentStep((prevStep) => Math.min(prevStep + 1, questions.length - 1));
  };

  const handleBack = () => {
    setError('');
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');
    if (Object.values(formData).some((value) => value === '')) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not logged in.');

      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        ...formData,
        createdAt: new Date(),
        email: user.email,
        displayName: user.displayName,
      });

      setSuccessMessage('Your profile has been successfully submitted!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Error saving user data:', err);
      setError('Failed to save data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-center text-blue-600">Complete Your Profile</h1>

        <div className="mt-4 space-y-4">
          {questions[currentStep].type === 'select' ? (
            <select
              name={questions[currentStep].name}
              value={formData[questions[currentStep].name]}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="" disabled>
                {questions[currentStep].label}
              </option>
              {questions[currentStep].options.map((option) => (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={questions[currentStep].type}
              name={questions[currentStep].name}
              value={formData[questions[currentStep].name]}
              onChange={handleChange}
              placeholder={questions[currentStep].label}
              required
              className="w-full px-4 py-2 border rounded-md"
            />
          )}
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

        <div className="flex mt-6">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-2 text-white font-semibold bg-gray-500 hover:bg-gray-600 rounded-md transition duration-300"
            >
              Back
            </button>
          )}

          <div className="ml-auto">
            {currentStep < questions.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2 text-white font-semibold bg-blue-500 hover:bg-blue-600 rounded-md transition duration-300"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2 text-white font-semibold bg-blue-500 hover:bg-blue-600 rounded-md transition duration-300"
              >
                {loading ? 'Saving...' : 'Submit'}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserDetailsForm;
