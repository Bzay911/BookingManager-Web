import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/Authcontext.tsx';
import LandingPage from '../LandingPage';

export default function RootRoute() {
    // This route will check if the user is logged in and redirect accordingly
  const { token, user } = useAuth();

  if (token && user) {
    return <Navigate to="/dashboard" replace />
  }

  return <LandingPage />
}