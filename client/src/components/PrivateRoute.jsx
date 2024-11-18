import { Navigate } from 'react-router-dom';
import { auth } from '../firebase/firebase-config'; // Firebase authentication

const PrivateRoute = ({ element }) => {
  const user = auth.currentUser; // Check if a user is logged in

  return user ? element : <Navigate to="/" />; // Redirect to home page if not logged in
};

export default PrivateRoute;
