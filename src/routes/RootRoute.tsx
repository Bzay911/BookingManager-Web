import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/Authcontext.tsx';

export default function RootRoute() {
  const { token, user } = useAuth();

  if (!token || !user) return <Navigate to="/landingPage" replace />;

  if (!user.role) return <Navigate to="/onboarding" replace />;

  if(user.role === "BUSINESS"){
    return <Navigate to="/dashboard" replace />;
  }

  if (user.role === 'CUSTOMER') {
    return <Navigate to="/browse" replace />;
  }
}