import type { ReactNode } from "react";
import { useAuth } from "../contexts/Authcontext";
import { Navigate } from "react-router-dom";


export default function DashboardGuard({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (!user.isOnBoarded) return <Navigate to="/setup-business" replace />;
  return <>{children}</>;
}