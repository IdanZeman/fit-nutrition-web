import React, { useState } from 'react';
import { db } from '../firebase/firebase-config'; // Import Firestore instance
import { doc, setDoc } from 'firebase/firestore'; // Firestore functions
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase-config'; // Import Firebase Auth
import coffeeImage from '../images/coffee-cup.png';
import maleImage from '../images/male.png';
import femaleImage from '../images/female.png';
import morningImage from '../images/morning.png';
import noonImage from '../images/noon.png';
import afternoonImage from '../images/afternoon.png';
import eveningImage from '../images/evening.png';

const UserDetailsForm = () => {
  const [formData, setFormData] = useState({
    height: 170,
    weight: 70,
    age: 25,
    gender: '',
    weeklyRunFrequency: '',
    runningPace: 180, // In seconds (3 minutes per km)
    exerciseTime: '',
    coffeeIntake: '',
    weightGoal: '63',
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
    if (name === 'weight') {
      const newWeight = value;
      setFormData({
        ...formData,
        weight: newWeight,
        weightGoal: newWeight - 5, // Update weightGoal to be 5 kg less than the new weight
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
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
          {questions[currentStep].label && (
            <div className="text-center text-lg font-medium text-gray-700">{questions[currentStep].label}</div>
          )}
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
          ) : questions[currentStep].name === 'weeklyRunFrequency' ? (
            <div className="mt-4">
              <label htmlFor="weeklyRunFrequency" className="block text-lg font-medium text-gray-700">
                Weekly Run Frequency
              </label>
              <select
                name="weeklyRunFrequency"
                id="weeklyRunFrequency"
                value={formData.weeklyRunFrequency}
                onChange={handleChange}
                className="w-full p-2 mt-2 border border-gray-300 rounded"
              >
                {questions[currentStep].options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
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
              <input
                type="text"
                name={questions[currentStep].name}
                value={formData[questions[currentStep].name]}
                onChange={handleChange}
                className="w-full p-2 mt-2 border border-gray-300 rounded"
                placeholder="Enter your answer"
              />
            </div>
          ) : null}
        </div>

        {error && <div className="text-red-500 text-center mt-2">{error}</div>}
        {successMessage && <div className="text-green-500 text-center mt-2">{successMessage}</div>}

        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={handleBack}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg disabled:opacity-50"
            disabled={currentStep === 0}
          >
            Back
          </button>
          <div>
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Next
            </button>
            {currentStep === questions.length - 1 && (
              <button
                type="submit"
                className="ml-4 px-4 py-2 bg-green-500 text-white rounded-lg"
                disabled={loading}
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
