import React, { useState } from 'react';
import { db } from './firebase-config'; // Import Firestore instance
import { doc, setDoc } from 'firebase/firestore'; // Firestore functions
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase-config'; // Import Firebase Auth
import coffeeImage from './images/coffee-cup.png';
import maleImage from './images/male.png';
import femaleImage from './images/female.png';

const UserDetailsForm = () => {
  const [formData, setFormData] = useState({
    height: 170,
    weight: 70,
    age: 25,
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
    { name: 'height', label: 'Height (cm)', type: 'slider', min: 100, max: 250, step: 1 },
    { name: 'weight', label: 'Weight (kg)', type: 'slider', min: 30, max: 200, step: 1 },
    { name: 'age', label: 'Age', type: 'slider', min: 18, max: 100, step: 1 },
    { name: 'gender', label: 'Gender', type: 'select', options: ['male', 'female'] },
    { name: 'weeklyRunFrequency', label: 'Weekly Run Frequency', type: 'select', options: ['0', '1-2', '3+'] },
    { name: 'runningPace', label: 'Running Pace (min/km)', type: 'text' },
    { name: 'exerciseTime', label: 'Preferred Exercise Time (e.g., morning)', type: 'text' },
    { name: 'mealFrequency', label: 'Daily Meal Frequency', type: 'number' },
    { name: 'coffeeIntake', label: 'Coffee Intake', type: 'select', options: ['0', '1-2', '3-5', '5+'] },
    { name: 'weightGoal', label: 'Weight Goal (e.g., lose 5kg)', type: 'text' },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
          {questions[currentStep].name === 'weeklyRunFrequency' ? (
            <div className="flex justify-between space-x-4">
              {questions[currentStep].options.map((option) => (
                <div
                  key={option}
                  onClick={() => setFormData({ ...formData, weeklyRunFrequency: option })}
                  className={`w-1/4 p-4 border rounded-lg text-center cursor-pointer ${
                    formData.weeklyRunFrequency === option ? 'bg-blue-500 text-white' : 'bg-white'
                  }`}
                >
                  <p className="font-semibold">{option}</p>
                  </div>
              ))}
            </div>
          ) : questions[currentStep].type === 'select' ? (
            questions[currentStep].name === 'gender' ? (
              <div className="flex justify-between space-x-4">
                {questions[currentStep].options.map((option) => (
                  <div
                    key={option}
                    onClick={() => setFormData({ ...formData, gender: option })}
                    className={`w-1/2 p-4 border rounded-lg text-center cursor-pointer ${
                      formData.gender === option ? 'bg-blue-500 text-white' : 'bg-white'
                    }`}
                  >
                    <img src={option === 'male' ? maleImage : femaleImage} alt={option} className="mx-auto mb-2 w-12 h-12" />
                    <p>{option.charAt(0).toUpperCase() + option.slice(1)}</p>
                  </div>
                ))}
              </div>
            ) : questions[currentStep].name === 'coffeeIntake' ? (
              <div className="flex justify-between space-x-4">
                {questions[currentStep].options.map((option) => (
                  <div
                    key={option}
                    onClick={() => setFormData({ ...formData, coffeeIntake: option })}
                    className={`w-1/4 p-4 border rounded-lg text-center cursor-pointer ${
                      formData.coffeeIntake === option ? 'bg-blue-500 text-white' : 'bg-white'
                    }`}
                  >
                    <img src={coffeeImage} alt={option} className="mx-auto mb-2 w-12 h-12" />
                    <p>{option}</p>
                  </div>
                ))}
              </div>
            ) : null
          ) : questions[currentStep].type === 'slider' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700">{questions[currentStep].label}</label>
              <input
                type="range"
                name={questions[currentStep].name}
                min={questions[currentStep].min}
                max={questions[currentStep].max}
                step={questions[currentStep].step}
                value={formData[questions[currentStep].name]}
                onChange={handleSliderChange}
                className="w-full mt-2"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{questions[currentStep].min}</span>
                <span>{formData[questions[currentStep].name]}</span>
                <span>{questions[currentStep].max}</span>
              </div>
            </div>
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

      <div className="flex justify-between mt-6">
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
              disabled={loading}
              className="px-6 py-2 text-white font-semibold bg-blue-500 hover:bg-blue-600 rounded-md transition duration-300"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          )}
        </div>
      </div>

      </form>
    </div>
  );
};

export default UserDetailsForm;
