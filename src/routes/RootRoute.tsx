import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/Authcontext.tsx';

export default function RootRoute() {
  const { token, user } = useAuth();


  // not logged in
  if (!token || !user) return <Navigate to="/landingPage" replace />;

  // logged in, no role
  if (!user.role) return <Navigate to="/onboarding" replace />;

  // business
  if (user.role === 'BUSINESS') {
    return user.isOnboarded
      ? <Navigate to="/dashboard" replace />
      : <Navigate to="/setup-business" replace />;
  }

  // customer
  if (user.role === 'CUSTOMER') {
    return <Navigate to="/browse" replace />;
  }
}