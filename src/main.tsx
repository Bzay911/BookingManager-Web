import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@fontsource/geist-sans/index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/AppRouter.tsx";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from "./contexts/Authcontext.tsx";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const GOOGLE_AUTH_API_KEY = import.meta.env.VITE_GOOGLE_AUTH_API_KEY; 
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
      <QueryClientProvider client={queryClient}>
    <AuthProvider>
    <GoogleOAuthProvider clientId={GOOGLE_AUTH_API_KEY}>
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
    </AuthProvider>
  </QueryClientProvider>
  </StrictMode>
);