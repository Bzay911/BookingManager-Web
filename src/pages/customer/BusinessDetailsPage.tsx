import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../contexts/Authcontext";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Phone,
  Store,
  Loader2,
  LogOut,
  DollarSign,
  Timer,
  LayoutGrid,
  AlertCircle,
  CalendarCheck,
  UserCircle,
  Image as ImageIcon,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const fetchBusinessDetails = async (id: string, token: string | null) => {
  const response = await fetch(
    `${API_BASE_URL}/api/business/get-business/${id}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!response.ok) throw new Error("Failed to fetch business details");
  return response.json();
};

const navItems = [
  { icon: LayoutGrid, label: "Browse All", path: "/browse" },
  { icon: CalendarCheck, label: "Your Bookings", path: "/bookings" },
  { icon: UserCircle, label: "Profile", path: "/profile" },
];

export default function BusinessDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();

  const {
    data: business,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["business", id],
    queryFn: () => fetchBusinessDetails(id as string, token),
    enabled: !!id,
  });

  const initials =
    user?.displayName
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "CU";

  if (isLoading)
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <Loader2 size={40} className="text-[#0be48d] animate-spin" />
      </div>
    );

  if (isError)
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <AlertCircle size={40} className="text-red-500" />
      </div>
    );

  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 shrink-0 bg-white border-r border-gray-100 flex flex-col py-6 px-4 z-20">
        <div className="flex items-center gap-3 px-2 mb-10 mt-2">
          <div className="w-9 h-9 bg-[#0be48d] rounded-xl flex items-center justify-center shadow-md shadow-[#0be48d]/20 text-white">
            <Store size={18} />
          </div>
          <span className="font-extrabold text-black text-lg tracking-tight">
            BookingManager
          </span>
        </div>
        <nav className="flex-1 flex flex-col gap-2">
          {navItems.map(({ icon: Icon, label, path }) => (
            <NavLink
              key={label}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all ${isActive ? "bg-gray-100 text-black shadow-sm" : "text-gray-500 hover:text-black hover:bg-gray-50"}`
              }
            >
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-gray-100 pt-4 mt-4 flex items-center gap-3 px-2">
          <Avatar className="w-9 h-9 border border-gray-100 shadow-sm">
            <AvatarImage src={user?.profileImage} />
            <AvatarFallback className="bg-black text-white text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-black truncate">
              {user?.displayName || "Guest"}
            </p>
          </div>
          <button
            onClick={logout}
            className="p-2 text-gray-400 hover:text-red-500 rounded-full transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-8 py-10">
          {/* Header Section */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-black transition-colors mb-4"
            >
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-4xl font-extrabold text-black tracking-tight mb-2">
              {business?.businessName}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1.5 font-medium">
                <MapPin size={16} />
                {business?.businessAddress}
              </div>
              <span className="text-blue-500 font-semibold cursor-pointer hover:underline">
                Show on map
              </span>
            </div>
          </div>

          {/* Image Gallery Bento Grid (Placeholder Style) */}
          <div className="grid grid-cols-4 grid-rows-2 gap-3 h-[500px] mb-12 rounded-3xl overflow-hidden">
            {/* Main Large Image */}
            <div className="col-span-2 row-span-2 bg-gray-100 flex items-center justify-center border border-gray-200 group relative cursor-pointer">
              <ImageIcon className="text-gray-300" size={48} />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all" />
            </div>
            {/* Top Side Image */}
            <div className="col-span-2 row-span-1 bg-gray-100 flex items-center justify-center border border-gray-200 group relative cursor-pointer">
              <ImageIcon className="text-gray-300" size={32} />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all" />
            </div>
            {/* Bottom Right 1 */}
            <div className="col-span-1 row-span-1 bg-gray-100 flex items-center justify-center border border-gray-200 group relative cursor-pointer">
              <ImageIcon className="text-gray-300" size={24} />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all" />
            </div>
            {/* Bottom Right 2 with "More Photos" logic */}
            <div className="col-span-1 row-span-1 bg-gray-100 flex items-center justify-center border border-gray-200 group relative cursor-pointer">
              <div className="text-center">
                <p className="font-bold text-gray-400">+12 photos</p>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all" />
            </div>
          </div>

          {/* Business Info & Services */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-black mb-4">
                  About this business
                </h2>
                <p className="text-gray-600 leading-relaxed font-medium">
                  {business?.description ||
                    "A premier destination for quality service and professional care. We specialize in providing a seamless experience for all our clients."}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-black mb-6">
                  Available Services
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {business?.services?.map((service: any) => (
                    <div
                      key={service.id}
                      className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-3xl hover:border-[#0be48d]/40 transition-all shadow-sm group"
                    >
                      <div>
                        <h3 className="font-bold text-lg text-black">
                          {service.service}
                        </h3>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm font-bold text-gray-400 flex items-center gap-1">
                            <Timer size={14} /> {service.durationMinutes} mins
                          </span>
                          <span className="text-[#0be48d] font-bold text-sm flex items-center gap-1">
                            <DollarSign size={14} /> {service.price}
                          </span>
                        </div>
                      </div>
                      <button className="px-6 py-3 rounded-2xl bg-black text-white text-sm font-bold group-hover:bg-[#0be48d] group-hover:text-black transition-all">
                        Book Now
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Sticky Sidebar (QR & Contact) */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                <h3 className="text-xl font-bold text-black mb-4 text-center">
                  Instant WhatsApp Booking
                </h3>
                <div className="bg-white p-4 rounded-3xl shadow-inner border border-gray-100 flex justify-center mb-6">
                  <QRCodeSVG
                    value={`https://wa.me/14155238886?text=${encodeURIComponent(
                      `BUSINESS:${business.id} Hi! I'd like to book an appointment at ${business.businessName}`,
                    )}`}
                    size={180}
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-gray-50">
                    <Clock size={18} className="text-[#0be48d]" />
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">
                        Hours
                      </p>
                      <p className="text-sm font-bold">
                        {business?.openingTime} - {business?.closingTime}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-gray-50">
                    <Phone size={18} className="text-[#0be48d]" />
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">
                        Phone
                      </p>
                      <p className="text-sm font-bold">
                        {business?.businessPhoneNumber}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-gray-400 text-center mt-6 font-medium uppercase tracking-widest">
                  Powered by BookingManager AI
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
