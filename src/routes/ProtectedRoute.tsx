import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/Authcontext.tsx";
import type { ReactNode } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { token, user } = useAuth();
  if (!token || !user) return <Navigate to="/" replace />;
  return <>{children}</>;
}
