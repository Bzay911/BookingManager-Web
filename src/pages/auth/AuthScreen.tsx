import { Card } from "../../components/ui/card";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useAuth } from "../../contexts/Authcontext";
import { useNavigate } from "react-router-dom";

export default function AuthScreen() {
  const API_URL = import.meta.env.VITE_API_URL;
  const { login } = useAuth();
  const navigate = useNavigate();


  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) return;
    const response = await fetch(`${API_URL}/api/auth/google-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        token: credentialResponse.credential,
        role: 'business'      
        }),
    });

    if (response.ok) {
      const data = await response.json();
      login(data.token, data.user);
        navigate('/dashboard')
    } else {
      console.error("Google login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50 px-6">
      <Card className="max-w-md w-full p-10 text-center">
        <h2 className="mb-4 text-gray-900 font-extrabold text-2xl md:text-3xl">
          Welcome to BookingManager
        </h2>
        <p className="mb-8 text-gray-600">
          One click with Google to sign in or create your account
        </p>

        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => console.log("Login Failed")}
        />
      </Card>
    </div>
  );
}
