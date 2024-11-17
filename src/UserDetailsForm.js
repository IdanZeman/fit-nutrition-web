import React, { useState } from 'react';
import { db } from './firebase-config'; // Import Firestore instance
import { doc, setDoc } from 'firebase/firestore'; // Firestore functions
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase-config'; // Import Firebase Auth
import coffeeImage from './images/coffee-cup.png';
import maleImage from './images/male.png';
import femaleImage from './images/female.png';
import morningImage from './images/morning.png';
import noonImage from './images/noon.png';
import afternoonImage from './images/afternoon.png';
import eveningImage from './images/evening.png';

const UserDetailsForm = () => {
  const [formData, setFormData] = useState({
    height: 170,
    weight: 70,
    age: 25,
    gender: '',
    weeklyRunFrequency: '',
    runningPace: 180, // In seconds (3 minutes per km)
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
    { name: 'runningPace', label: 'Running Pace (min/km)', type: 'slider', min: 180, max: 480, step: 10 }, // Values in seconds
    { name: 'exerciseTime', label: 'Preferred Exercise Time (e.g., morning)', type: 'select', options: ['morning', 'noon', 'afternoon', 'evening'] },
    { name: 'coffeeIntake', label: 'Coffee Intake', type: 'select', options: ['0', '1-2', '3-5', '5+'] },
    { name: 'weightGoal', label: 'Weight Goal (e.g., lose 5kg)', type: 'slider', min: 30, max: 200, step: 1 },
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

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
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
        {questions[currentStep].name === 'coffeeIntake' ? (
            <div className="flex justify-between space-x-4">
              {questions[currentStep].options.map((option) => (
                <div
                  key={option}
                  onClick={() => setFormData({ ...formData, coffeeIntake: option })}
                  className={`w-1/4 p-4 border rounded-lg text-center cursor-pointer ${
                    formData.coffeeIntake === option ? 'bg-blue-500 text-white' : 'bg-white'
                  }`}
                >
                  <img src={coffeeImage} alt="Coffee" className="mx-auto mb-2 w-12 h-12" />
                  <p>{option}</p>
                </div>
              ))}
            </div>
          ) : questions[currentStep].type === 'select' && questions[currentStep].name === 'gender' ? (
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
          ) : questions[currentStep].type === 'select' && questions[currentStep].name === 'exerciseTime' ? (
            <div className="flex justify-between space-x-4">
              {questions[currentStep].options.map((option) => (
                <div
                  key={option}
                  onClick={() => setFormData({ ...formData, exerciseTime: option })}
                  className={`w-1/4 p-4 border rounded-lg text-center cursor-pointer ${
                    formData.exerciseTime === option ? 'bg-blue-500 text-white' : 'bg-white'
                  }`}
                >
                  <img src={option === 'morning' ? morningImage : option === 'noon' ? noonImage : option === 'afternoon' ? afternoonImage : eveningImage} alt={option} className="mx-auto mb-2 w-12 h-12" />
                  <p>{option.charAt(0).toUpperCase() + option.slice(1)}</p>
                </div>
              ))}
            </div>
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
                <span>{questions[currentStep].name === 'runningPace' ? formatTime(formData.runningPace) : formData[questions[currentStep].name]}</span>
              </div>
            </div>
          ) : questions[currentStep].type === 'text' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700">{questions[currentStep].label}</label>
              <input
                type="text"
                name={questions[currentStep].name}
                value={formData[questions[currentStep].name]}
                onChange={handleChange}
                className="w-full mt-2 border p-2 rounded-md"
              />
            </div>
          ) : questions[currentStep].type === 'select' ? (
            <div className="flex justify-between space-x-4">
              {questions[currentStep].options.map((option) => (
                <div
                  key={option}
                  onClick={() => setFormData({ ...formData, weeklyRunFrequency: option })}
                  className={`w-1/4 p-4 border rounded-lg text-center cursor-pointer ${
                    formData.weeklyRunFrequency === option ? 'bg-blue-500 text-white' : 'bg-white'
                  }`}
                >
                  <p>{option}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {error && <div className="text-red-600 mt-4">{error}</div>}
        {successMessage && <div className="text-green-600 mt-4">{successMessage}</div>}

        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="bg-gray-500 text-white py-2 px-4 rounded"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={loading}
            className="bg-blue-600 text-white py-2 px-4 rounded"
          >
            Next
          </button>
        </div>

        {currentStep === questions.length - 1 && (
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white py-2 px-4 rounded mt-4 w-full"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        )}
      </form>
    </div>
  );
};

export default UserDetailsForm;
