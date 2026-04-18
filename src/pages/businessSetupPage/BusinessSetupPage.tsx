import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Store,
  MapPin,
  Phone,
  Mail,
  AlignLeft,
  Clock,
  Percent,
  Plus,
  X,
  ArrowRight,
  DollarSign,
  Timer,
  MessageCircle,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../contexts/Authcontext";

interface Service {
  name: string;
  price: string;
  duration: string;
}

const API_URL = import.meta.env.VITE_API_URL;

export default function SetupBusinessPage() {
  const navigate = useNavigate();
  const { user, token, logout, setUser } = useAuth();

  // Loading States
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // Verification State
  const [showVerification, setShowVerification] = useState(false);
  const [otp, setOtp] = useState("");

  // Form State
  const [businessName, setBusinessName] = useState("");
  const [description, setDescription] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessPhoneNumber, setBusinessPhoneNumber] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [openingTime, setOpeningTime] = useState("");
  const [closingTime, setClosingTime] = useState("");
  const [cancellationFee, setCancellationFee] = useState("");

  const [services, setServices] = useState<Service[]>([]);
  const [serviceName, setServiceName] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [serviceDuration, setServiceDuration] = useState("");

  const handleAddService = (e: React.MouseEvent | React.FormEvent) => {
    e.preventDefault();
    if (serviceName.trim() && servicePrice.trim() && serviceDuration.trim()) {
      if (
        !services.some(
          (s) => s.name.toLowerCase() === serviceName.trim().toLowerCase(),
        )
      ) {
        setServices([
          ...services,
          {
            name: serviceName.trim(),
            price: servicePrice.trim(),
            duration: serviceDuration.trim(),
          },
        ]);
        setServiceName("");
        setServicePrice("");
        setServiceDuration("");
      }
    }
  };

  const removeService = (nameToRemove: string) => {
    setServices(services.filter((s) => s.name !== nameToRemove));
  };

  // Intercept the form submission to show the OTP Modal
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/business/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          businessPhoneNumber,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to send OTP");
      }
      const data = await response.json();
      console.log("OTP sent successfully:", data);
      setShowVerification(true); // Pop up the modal!
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert(
        "There was an error sending the verification code. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // The final verification and database save
  const handleVerify = async () => {
    if (otp.length !== 6) return;
    setVerifying(true);

    try {
      const otpResponse = await fetch(`${API_URL}/api/business/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          businessPhoneNumber,
          code: otp,
        }),
      });
      const otpData = await otpResponse.json();

      console.log("OTP data:", otpData);

      if (!otpResponse.ok || !otpData.success) {
        alert(otpData.error || "Incorrect code. Please try again.");
        setVerifying(false);
        return;
      }

      const response = await fetch(`${API_URL}/api/business/setup-business`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          businessName,
          description,
          businessAddress,
          businessPhoneNumber,
          businessEmail,
          openingTime,
          closingTime,
          cancellationFee: parseFloat(cancellationFee),
          services,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setUser({ ...user!, isOnBoarded: true });
        console.log("Business setup successful:", data);
        setShowVerification(false);
        alert("Your business has been set up successfully!");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("There was an error verifying the OTP. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const isFormValid =
    businessName &&
    businessAddress &&
    businessPhoneNumber &&
    businessEmail &&
    openingTime &&
    closingTime &&
    cancellationFee &&
    services.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 flex flex-col items-center font-sans relative overflow-x-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#0be48d] opacity-[0.05] blur-[120px] rounded-full pointer-events-none"></div>

      {/* VERIFICATION MODAL OVERLAY */}
      {showVerification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-10 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-[#0be48d]/10 rounded-2xl flex items-center justify-center mb-6 text-[#0be48d] mx-auto shadow-sm border border-[#0be48d]/20">
              <MessageCircle size={32} />
            </div>

            <h2 className="text-3xl font-extrabold text-black text-center mb-2 tracking-tight">
              Check your WhatsApp
            </h2>
            <p className="text-center text-gray-500 font-medium mb-8">
              We just sent a 6-digit verification code to <br />
              <span className="font-bold text-black">
                {businessPhoneNumber}
              </span>
            </p>

            <div className="mb-8">
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))} // Only allow numbers
                placeholder="000000"
                className="w-full text-center text-4xl font-black tracking-[0.5em] py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 text-black placeholder:text-gray-300 focus:bg-white focus:border-[#0be48d] focus:ring-4 focus:ring-[#0be48d]/10 transition-all outline-none"
              />
            </div>

            <button
              onClick={handleVerify}
              disabled={otp.length !== 6 || verifying}
              className={`w-full py-4 rounded-full text-lg font-bold transition-all duration-300 flex items-center justify-center gap-2 mb-4
                ${
                  otp.length !== 6
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-black text-white hover:bg-[#0be48d] hover:text-black shadow-xl"
                }`}
            >
              {verifying ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Verifying...
                </>
              ) : (
                <>
                  <ShieldCheck size={20} /> Verify & Activate
                </>
              )}
            </button>

            {/* The Escape Hatch! */}
            <button
              onClick={() => setShowVerification(false)}
              className="w-full py-3 text-sm font-bold text-gray-400 hover:text-black flex items-center justify-center gap-2 transition-colors"
            >
              <ArrowLeft size={16} /> Wait, I need to change my number
            </button>
          </div>
        </div>
      )}

      {/* --- REST OF THE FORM REMAINS EXACTLY THE SAME --- */}

      <div className="w-full max-w-3xl mb-10 relative z-10 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
          <div className="w-8 h-8 bg-[#0be48d] rounded-lg flex items-center justify-center shadow-md shadow-[#0be48d]/20">
            <Store size={16} className="text-white" />
          </div>
          <span className="font-extrabold text-black text-lg tracking-tight">
            BookingManager
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-black tracking-tight mb-4">
          Let's set up your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0be48d] to-emerald-400">
            workspace.
          </span>
        </h1>
        <p className="text-gray-500 text-lg font-medium">
          Add your details below so customers can find and book with you.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl relative z-10 space-y-6"
      >
        <button
          className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          onClick={logout}
          title="Log out"
        >
          <LogOut size={16} />
        </button>
        {/* SECTION 1: Basic Profile */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden p-8 md:p-10">
          <h2 className="text-xl font-bold text-black mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-gray-50 text-black border border-gray-100 flex items-center justify-center text-sm font-bold shadow-sm">
              1
            </span>
            Basic Profile
          </h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Business Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <Store size={20} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full pl-12 pr-5 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 text-black font-medium focus:bg-white focus:border-[#0be48d] focus:ring-4 focus:ring-[#0be48d]/10 transition-all outline-none"
                    placeholder="e.g., The Spearwood Bakery"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Business Email *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <Mail size={20} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={businessEmail}
                    onChange={(e) => setBusinessEmail(e.target.value)}
                    className="w-full pl-12 pr-5 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 text-black font-medium focus:bg-white focus:border-[#0be48d] focus:ring-4 focus:ring-[#0be48d]/10 transition-all outline-none"
                    placeholder="hello@yourbusiness.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  WhatsApp Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <Phone size={20} className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={businessPhoneNumber}
                    onChange={(e) => setBusinessPhoneNumber(e.target.value)}
                    className="w-full pl-12 pr-5 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 text-black font-medium focus:bg-white focus:border-[#0be48d] focus:ring-4 focus:ring-[#0be48d]/10 transition-all outline-none"
                    placeholder="+61 400 000 000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Location / Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <MapPin size={20} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                    className="w-full pl-12 pr-5 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 text-black font-medium focus:bg-white focus:border-[#0be48d] focus:ring-4 focus:ring-[#0be48d]/10 transition-all outline-none"
                    placeholder="e.g., Perth, WA"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Description (Optional)
              </label>
              <div className="relative">
                <div className="absolute top-4 left-0 pl-5 pointer-events-none">
                  <AlignLeft size={20} className="text-gray-400" />
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full pl-12 pr-5 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 text-black font-medium focus:bg-white focus:border-[#0be48d] focus:ring-4 focus:ring-[#0be48d]/10 transition-all outline-none resize-none"
                  placeholder="Tell customers a little bit about what makes your business special..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Operations & Policies */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden p-8 md:p-10">
          <h2 className="text-xl font-bold text-black mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-gray-50 text-black border border-gray-100 flex items-center justify-center text-sm font-bold shadow-sm">
              2
            </span>
            Operations & Policies
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Opening Time *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Clock size={20} className="text-gray-400" />
                </div>
                <input
                  type="time"
                  required
                  value={openingTime}
                  onChange={(e) => setOpeningTime(e.target.value)}
                  className="w-full pl-12 pr-5 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 text-black font-medium focus:bg-white focus:border-[#0be48d] focus:ring-4 focus:ring-[#0be48d]/10 transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Closing Time *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Clock size={20} className="text-gray-400" />
                </div>
                <input
                  type="time"
                  required
                  value={closingTime}
                  onChange={(e) => setClosingTime(e.target.value)}
                  className="w-full pl-12 pr-5 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 text-black font-medium focus:bg-white focus:border-[#0be48d] focus:ring-4 focus:ring-[#0be48d]/10 transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Cancellation Fee *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Percent size={20} className="text-gray-400" />
                </div>
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  step="0.01"
                  value={cancellationFee}
                  onChange={(e) => setCancellationFee(e.target.value)}
                  className="w-full pl-12 pr-5 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 text-black font-medium focus:bg-white focus:border-[#0be48d] focus:ring-4 focus:ring-[#0be48d]/10 transition-all outline-none"
                  placeholder="e.g., 20"
                />
                <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none">
                  <span className="text-gray-400 font-bold">%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: Detailed Services */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden p-8 md:p-10">
          <h2 className="text-xl font-bold text-black mb-2 flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-gray-50 text-black border border-gray-100 flex items-center justify-center text-sm font-bold shadow-sm">
              3
            </span>
            Services Offered *
          </h2>
          <p className="text-sm text-gray-500 font-medium mb-6 ml-11">
            Add at least one service. You can edit or add more later in your
            dashboard.
          </p>

          <div className="ml-0 md:ml-11 space-y-6">
            <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100 flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-500 mb-1 ml-2">
                  Service Name
                </label>
                <input
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 bg-white text-black font-medium focus:border-[#0be48d] focus:ring-4 focus:ring-[#0be48d]/10 transition-all outline-none"
                  placeholder="e.g., Men's Haircut"
                />
              </div>

              <div className="flex gap-4">
                <div className="w-28">
                  <label className="block text-xs font-bold text-gray-500 mb-1 ml-2">
                    Price
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <DollarSign size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={servicePrice}
                      onChange={(e) => setServicePrice(e.target.value)}
                      className="w-full pl-9 pr-4 py-3.5 rounded-2xl border border-gray-200 bg-white text-black font-medium focus:border-[#0be48d] focus:ring-4 focus:ring-[#0be48d]/10 transition-all outline-none"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="w-32">
                  <label className="block text-xs font-bold text-gray-500 mb-1 ml-2">
                    Duration (min)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Timer size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      min="5"
                      step="5"
                      value={serviceDuration}
                      onChange={(e) => setServiceDuration(e.target.value)}
                      className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-gray-200 bg-white text-black font-medium focus:border-[#0be48d] focus:ring-4 focus:ring-[#0be48d]/10 transition-all outline-none"
                      placeholder="30"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleAddService}
                  disabled={
                    !serviceName.trim() ||
                    !servicePrice.trim() ||
                    !serviceDuration.trim()
                  }
                  className="w-full md:w-auto px-6 py-3.5 rounded-2xl bg-black text-white font-bold disabled:bg-gray-200 disabled:text-gray-400 hover:bg-[#0be48d] hover:text-black transition-colors flex items-center justify-center gap-2 h-[50px]"
                >
                  <Plus size={20} />
                  <span className="md:hidden">Add Service</span>
                </button>
              </div>
            </div>

            {services.length > 0 ? (
              <div className="flex flex-col gap-3">
                {services.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-white border border-gray-100 shadow-sm rounded-2xl group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#0be48d]/10 text-[#0be48d] flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-bold text-black text-base">
                          {service.name}
                        </p>
                        <div className="flex items-center gap-3 text-sm font-medium text-gray-500 mt-0.5">
                          <span className="flex items-center gap-1">
                            <DollarSign size={14} />
                            {service.price}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                          <span className="flex items-center gap-1">
                            <Timer size={14} />
                            {service.duration} mins
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeService(service.name)}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 border-2 border-dashed border-gray-200 rounded-3xl text-center">
                <p className="text-sm font-medium text-gray-400">
                  No services added yet. Fill out the form above.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4 pb-12">
          <button
            type="submit"
            disabled={loading || !isFormValid}
            className={`px-10 py-5 rounded-full text-lg font-bold transition-all duration-300 flex items-center justify-center gap-3 w-full md:w-auto
              ${!isFormValid ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-black text-white hover:bg-[#0be48d] hover:text-black shadow-xl hover:-translate-y-1 hover:shadow-2xl"}`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Sending Code...
              </>
            ) : (
              "Complete Setup"
            )}
            {!loading && <ArrowRight size={20} />}
          </button>
        </div>
      </form>
    </div>
  );
}
