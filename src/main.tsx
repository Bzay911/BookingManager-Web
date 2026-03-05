import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/AppRouter.tsx";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from "./contexts/Authcontext.tsx";

const GOOGLE_AUTH_API_KEY = import.meta.env.VITE_GOOGLE_AUTH_API_KEY; 

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
    <GoogleOAuthProvider clientId={GOOGLE_AUTH_API_KEY}>
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
    </AuthProvider>
  </StrictMode>
);