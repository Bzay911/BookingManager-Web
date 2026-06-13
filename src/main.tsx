import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@fontsource/geist-sans/index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/AppRouter.tsx";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from "./contexts/Authcontext.tsx";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "sonner";
import {ImageKitProvider} from "@imagekit/react";

const GOOGLE_AUTH_API_KEY = import.meta.env.VITE_GOOGLE_AUTH_API_KEY;
const IMAGEKIT_URL_ENDPOINT = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
      <QueryClientProvider client={queryClient}>
    <AuthProvider>
    <GoogleOAuthProvider clientId={GOOGLE_AUTH_API_KEY}>
      <ImageKitProvider urlEndpoint={IMAGEKIT_URL_ENDPOINT}>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors closeButton />
      </ImageKitProvider>
    </GoogleOAuthProvider>
    </AuthProvider>
  </QueryClientProvider>
  </StrictMode>
);