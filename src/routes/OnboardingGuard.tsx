import type { ReactNode } from "react";
import { useAuth } from "../contexts/Authcontext";
import { Navigate } from "react-router-dom";

export default function OnboardingGuard({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  // If user is not logged in or already has a role, redirect to root
  if (!user) return <Navigate to="/" replace />;
  if (user.role) return <Navigate to="/" replace />; 
  return <>{children}</>;
}