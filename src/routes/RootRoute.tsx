import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/Authcontext.tsx';
// import LandingPage from '../LandingPage';

// export default function RootRoute() {
//     // This route will check if the user is logged in and redirect accordingly
//   const { token, user } = useAuth();

//   if (token && user) {
//     return <Navigate to="/dashboard" replace />
//   }

//   return <LandingPage />
// }

export default function RootRoute() {
  const { token, user } = useAuth();

  console.log('RootRoute user:', user);

  // not logged in
  if (!token || !user) return <Navigate to="/auth" replace />;

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