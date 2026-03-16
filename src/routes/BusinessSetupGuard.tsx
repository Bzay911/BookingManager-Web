import type { ReactNode } from "react";
import { useAuth } from "../contexts/Authcontext";
import { Navigate } from "react-router-dom";


export default function BusinessSetupGuard({ children }: { children: ReactNode }) {
    const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (user.role !== 'BUSINESS') return <Navigate to="/" replace />;
  if (user.isOnBoarded) return <Navigate to="/dashboard" replace />; 

  return <>{children}</>;
}