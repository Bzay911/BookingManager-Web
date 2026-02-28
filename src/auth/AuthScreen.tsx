import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const navigate = useNavigate();

  const handleGoogleAuth = async () => {
    alert("Google sign-in/signup triggered!");
    navigate("/dashboard");
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

        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-3"
          onClick={handleGoogleAuth}
        >
          <LogIn className="w-5 h-5" />
          Continue with Google
        </Button>
      </Card>
    </div>
  );
}