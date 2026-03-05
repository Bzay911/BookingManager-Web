import { Card } from "../../components/ui/card";
import { useAuth } from "../../contexts/Authcontext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50 px-6">
      <Card className="max-w-md w-full p-10 text-center">
        <h2 className="mb-4 text-gray-900 font-extrabold text-2xl md:text-3xl">
          Welcome to BookingManager
        </h2>
        <p className="mb-8 text-gray-600">
          {user ? `Welcome back, ${user.displayName}!` : "Please sign in to continue."}
        </p>
      </Card>
    </div>
  );
}
