import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/Authcontext.tsx";

export default function ProtectedRoute({children,}: {children: React.ReactNode;}) {
  const { token, user } = useAuth();

  console.log("ProtectedRoute - token:", token);
  console.log("ProtectedRoute - user:", user);

  const isLoggedIn = !!token && !!user;

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
