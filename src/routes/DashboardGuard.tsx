import type { ReactNode } from "react";
import { useAuth } from "../contexts/Authcontext";
import { Navigate } from "react-router-dom";


export default function DashboardGuard({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (!user.role) return <Navigate to="/onboarding" replace />;
  if (user.role === 'BUSINESS' && !user.isOnBoarded) return <Navigate to="/setup-business" replace />;
  // if (user.role === 'CUSTOMER') return <Navigate to="/browse" replace />;
  return <>{children}</>;
}