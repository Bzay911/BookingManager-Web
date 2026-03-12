import { useState } from "react"; // Added useState
import { Card } from "../../components/ui/card";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useAuth } from "../../contexts/Authcontext";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react"; 

export default function AuthScreen() {
  const API_URL = import.meta.env.VITE_API_URL;
  const { login } = useAuth();
  const navigate = useNavigate();
  
  // 1. Create the loading state
  const [isLoading, setIsLoading] = useState(false);

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) return;
    
    // 2. Start the loading indicator
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/api/auth/google-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          token: credentialResponse.credential,
        }),
      });

      if (response.ok) {
        const data = await response.json();
console.log('received from backend:', data.user);
login(data.token, data.user);
        login(data.token, data.user);
        navigate('/');
        // Note: We don't set isLoading to false here because we want the spinner 
        // to stay visible while the page transitions to the dashboard.
      } else {
        console.error("Google login failed");
        setIsLoading(false); // Stop loading if authentication failed
      }
    } catch (error) {
      console.error("Network error during login:", error);
      setIsLoading(false); // Stop loading if the network drops
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 relative overflow-hidden font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0be48d] opacity-[0.07] blur-[100px] rounded-full pointer-events-none"></div>
      
      <Card className="max-w-md w-full p-8 text-center relative z-10 border border-gray-100 shadow-2xl rounded-[2rem] bg-white">
        
        <h2 className="mb-2 text-black font-extrabold text-2xl md:text-3xl tracking-tight">
          Welcome back
        </h2>
        <p className="mb-6 text-gray-500 text-base">
          Sign in or create your account to continue.
        </p>

        {/* 3. Conditionally render either the spinner or the Google button */}
        <div className="w-full flex justify-center items-center min-h-[44px]">
          {isLoading ? (
            <div className="flex items-center gap-2 text-gray-500 font-medium bg-gray-50 px-6 py-2 rounded-full w-full justify-center border border-gray-100">
              <Loader2 className="w-5 h-5 animate-spin text-[#0be48d]" />
              Authenticating...
            </div>
          ) : (
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => console.log("Login Failed")}
              theme="filled_black"
              size="large"
              width="100%"
              shape="pill"
            />
          )}
        </div>
        
        <p className="mt-6 text-xs text-gray-400">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </Card>
    </div>
  );
}