// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";  // Import Firebase Auth
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBjW_Vp33XtTmap04sHExi2bEuNBaDYR0I",
  authDomain: "fit-nutrition-web.firebaseapp.com",
  databaseURL: "https://fit-nutrition-web-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "fit-nutrition-web",
  storageBucket: "fit-nutrition-web.firebasestorage.app",
  messagingSenderId: "343844114401",
  appId: "1:343844114401:web:0876aacb12e1e666ad0ca0",
  measurementId: "G-LVLBNP6PVK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);

// Initialize Firebase Auth
const auth = getAuth(app);  // Get the Auth instance

// Export auth to be used in other files
export { auth };