import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/Authcontext.tsx';

export default function RootRoute() {
  const { token, user } = useAuth();

  if (!token || !user) return <Navigate to="/landingPage" replace />;

  return user.isOnBoarded
    ? <Navigate to="/dashboard" replace />
    : <Navigate to="/setup-business" replace />;

}