import React, { useState } from 'react';
import { auth, db } from './firebase-config';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const provider = new GoogleAuthProvider();

const SignUp = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');

      // Sign in with Google using a popup
      const result = await signInWithPopup(auth, provider);
      console.log('Sign-in result:', result);

      // Extract user and additional information
      const user = result.user;

      console.log('User:', user);

      // Firestore user reference
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        // Create new user in Firestore
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: new Date(),
        });

        console.log('New user added to Firestore');
        await getGoogleCalendarData(user);
        navigate('/UserDetailsForm');
      } else {
        console.log('Existing user data:', userDoc.data());
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Error signing in with Google. Please try again.');
      console.error('Google Sign-In Error:', err.message);
    } finally {
      setLoading(false);
    }
  };

// Function to fetch Google Calendar events
const getGoogleCalendarData = async (user) => {
  try {
    const accessToken = await user.getIdToken();  // Firebase access token
    // Initialize the Google Calendar API client
    window.gapi.load('client:auth2', async () => {
      try {
        await window.gapi.client.init({
          apiKey: 'AIzaSyBjW_Vp33XtTmap04sHExi2bEuNBaDYR0I', // Replace with your actual API key
          clientId: '343844114401-jeib4l5iajupdu4jf12upqu3g9f7t0fv.apps.googleusercontent.com', // Replace with your actual OAuth client ID
          discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
          scope: 'https://www.googleapis.com/auth/calendar.readonly', // Add the calendar access scope
        });

        // Sign in the user, if not already signed in
        const googleAuth = window.gapi.auth2.getAuthInstance();
        const userSignedIn = googleAuth.isSignedIn.get();

        if (!userSignedIn) {
          await googleAuth.signIn();  // This will prompt the user for calendar permissions
        }

        // Fetch the upcoming events from the user's Google Calendar
        const response = await window.gapi.client.calendar.events.list({
          calendarId: 'primary',
          timeMin: (new Date()).toISOString(),
          showDeleted: false,
          singleEvents: true,
          orderBy: 'startTime',
        });

        console.log('Upcoming Google Calendar events:', response);
        // Store events in your Firestore or state, as needed
      } catch (err) {
        console.error('Error during Google Calendar API initialization or request:', err);
        if (err && err.message) {
          console.error('Error message:', err.message);
        }
        if (err && err.response) {
          console.error('Error response:', err.response);
        }
        alert('An error occurred while fetching your calendar data. Please try again.');
      }
    });
  } catch (err) {
    console.error('Error during the Google Calendar setup:', err);
    alert('An error occurred while setting up Google Calendar. Please try again.');
  }
};


  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-center text-blue-600">Sign In</h1>

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleGoogleSignIn}
            className="w-full px-6 py-2 text-white font-semibold bg-red-500 hover:bg-red-600 rounded-md transition duration-300"
          >
            {loading ? 'Signing In with Google...' : 'Sign In with Google'}
          </button>
        </div>

        {error && (
          <div className="mt-4 text-red-600 bg-red-100 p-2 rounded-md">
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;
