import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/Authcontext";
import { Store, User, Loader2, CheckCircle2 } from "lucide-react";
import { LogOut } from "lucide-react";

type Role = "BUSINESS" | "CUSTOMER";

const API_URL = import.meta.env.VITE_API_URL;

export default function OnboardingPage() {
  const [selected, setSelected] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token, setUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleContinue = async () => {
    if (!selected) return;
    console.log("Selected role:", selected);
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/auth/update-role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: selected }),
      });

      if (!res.ok) throw new Error("Failed to update role");

      const data = await res.json();
      setUser(data.user);

      if (selected === "CUSTOMER") navigate("/browse");
      else navigate("/setup-business");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 relative overflow-hidden font-sans">
      {/* Subtle background glow matching the auth screen */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#0be48d] opacity-[0.06] blur-[100px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-3xl">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-widest uppercase text-[#0be48d] mb-4">
            Welcome aboard
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-black tracking-tight mb-4">
            How will you use <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0be48d] to-emerald-400">
              BookingManager?
            </span>
          </h1>
          <p className="text-gray-500 text-lg font-medium max-w-md mx-auto">
            This helps us tailor your experience. Don't worry, you can always change this later in settings.
          </p>
        </div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12 max-w-2xl mx-auto">
          {/* Business Card */}
          <button
            onClick={() => setSelected("BUSINESS")}
            className={`relative text-left rounded-3xl p-8 border-2 transition-all duration-300 group
              ${
                selected === "BUSINESS"
                  ? "border-[#0be48d] bg-[#0be48d]/5 shadow-md scale-[1.02]"
                  : "border-gray-100 bg-white hover:border-[#0be48d]/30 hover:shadow-lg"
              }`}
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                selected === "BUSINESS" ? "bg-[#0be48d] text-black shadow-sm" : "bg-gray-50 text-gray-400 group-hover:bg-[#0be48d]/10 group-hover:text-[#0be48d]"
              }`}>
                <Store size={28} />
              </div>
              {selected === "BUSINESS" && (
                <CheckCircle2 size={28} className="text-[#0be48d]" />
              )}
            </div>
            <p className="text-black font-extrabold text-2xl mb-2">Business</p>
            <p className="text-gray-500 font-medium leading-relaxed">
              Manage your services, track daily bookings, and control your live queue.
            </p>
          </button>

          {/* Customer Card */}
          <button
            onClick={() => setSelected("CUSTOMER")}
            className={`relative text-left rounded-3xl p-8 border-2 transition-all duration-300 group
              ${
                selected === "CUSTOMER"
                  ? "border-[#0be48d] bg-[#0be48d]/5 shadow-md scale-[1.02]"
                  : "border-gray-100 bg-white hover:border-[#0be48d]/30 hover:shadow-lg"
              }`}
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                selected === "CUSTOMER" ? "bg-[#0be48d] text-black shadow-sm" : "bg-gray-50 text-gray-400 group-hover:bg-[#0be48d]/10 group-hover:text-[#0be48d]"
              }`}>
                <User size={28} />
              </div>
              {selected === "CUSTOMER" && (
                <CheckCircle2 size={28} className="text-[#0be48d]" />
              )}
            </div>
            <p className="text-black font-extrabold text-2xl mb-2">Customer</p>
            <p className="text-gray-500 font-medium leading-relaxed">
              Discover local businesses, book appointments, and join queues remotely.
            </p>
          </button>
        </div>

        {/* Action Area */}
        <div className="max-w-md mx-auto text-center">
          <button
            onClick={handleContinue}
            disabled={!selected || loading}
            className={`w-full py-5 rounded-full text-lg font-bold transition-all duration-300 flex items-center justify-center
              ${
                selected && !loading
                  ? "bg-black text-white hover:bg-[#0be48d] hover:text-black shadow-xl hover:shadow-2xl hover:-translate-y-1"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-3 text-[#0be48d]" />
                Setting up your account...
              </>
            ) : (
              "Continue"
            )}
          </button>

          {/* Error Message */}
          {error && (
            <p className="text-sm font-bold text-red-500 mt-4 bg-red-50 py-2 rounded-xl inline-block px-4">
              {error}
            </p>
          )}
        </div>

              <button 
              className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" 
              onClick={logout}
              title="Log out"
            >
              <LogOut size={16} />
            </button>

      </div>
    </div>
  );
}