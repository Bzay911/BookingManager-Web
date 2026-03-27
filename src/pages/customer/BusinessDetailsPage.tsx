import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../contexts/Authcontext";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Phone,
  Store,
  Loader2,
  DollarSign,
  Timer,
  AlertCircle,
  Image as ImageIcon,
  MessageCircle
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Badge } from "../../components/ui/badge";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const fetchBusinessDetails = async (id: string) => {
  const response = await fetch(
    `${API_BASE_URL}/api/business/get-business/${id}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  if (!response.ok) throw new Error("Failed to fetch business details");
  return response.json();
};

export default function BusinessDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: business,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["business", id],
    queryFn: () => fetchBusinessDetails(id as string),
    enabled: !!id,
  });

  const whatsappUrl = `https://wa.me/14155238886?text=${encodeURIComponent(
    `BUSINESS:${business?.id} Hi! I'd like to book an appointment at ${business?.businessName}`
  )}`;

  if (isLoading)
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
        <Loader2 size={32} className="text-[#0be48d] animate-spin mb-4" />
        <p className="text-sm text-gray-500 font-medium">Loading details...</p>
      </div>
    );

  if (isError)
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
        <AlertCircle size={32} className="text-red-500 mb-4" />
        <p className="font-semibold text-gray-900">Unable to load business</p>
        <button onClick={() => navigate('/browse')} className="mt-4 text-sm text-[#0be48d] font-semibold hover:underline">
          Return to Browse
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-[#0be48d]/20">
      {/* --- REFINED HEADER --- */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/browse" className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 bg-[#0be48d] rounded-lg flex items-center justify-center shadow-sm">
              <Store size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900">BookingManager</span>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Breadcrumb */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-900 transition-colors mb-8"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Browse
        </button>

        {/* Business Hero Info */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
              <Badge className="bg-slate-100 text-slate-600 border-none px-2.5 py-0.5 font-semibold text-[10px] tracking-wide">
                Verified Business
              </Badge>
              <div className="flex items-center gap-1 text-sm font-medium text-slate-600">
                  <span className="text-yellow-400">★</span> 4.9
              </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            {business?.businessName}
          </h1>
          <div className="flex items-center gap-2 text-slate-500 mt-3 text-sm">
            <MapPin size={16} className="text-[#0be48d]" />
            <span className="font-medium">{business?.businessAddress}</span>
          </div>
        </div>

        {/* Professional Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-3 h-auto md:h-[480px] mb-12 rounded-2xl overflow-hidden border border-slate-100">
          <div className="md:col-span-2 md:row-span-2 bg-slate-50 flex items-center justify-center border-r border-slate-100 group relative">
            <ImageIcon className="text-slate-200 group-hover:scale-105 transition-transform duration-700" size={48} />
          </div>
          <div className="md:col-span-2 md:row-span-1 bg-slate-50 flex items-center justify-center border-b border-slate-100 group relative">
            <ImageIcon className="text-slate-200 group-hover:scale-105 transition-transform duration-700" size={32} />
          </div>
          <div className="md:col-span-1 md:row-span-1 bg-slate-50 flex items-center justify-center border-r border-slate-100 group relative">
            <ImageIcon className="text-slate-200 group-hover:scale-105 transition-transform duration-700" size={24} />
          </div>
          <div className="md:col-span-1 md:row-span-1 bg-slate-100 flex items-center justify-center group relative">
             <div className="text-center">
                <p className="font-bold text-slate-600 text-sm">View All</p>
                <p className="text-[10px] text-slate-400 font-medium uppercase">12+ Photos</p>
             </div>
          </div>
        </div>

        {/* Main Content Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">
          <div className="lg:col-span-7">
            {/* About Section */}
            <section className="mb-12">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Description
              </h2>
              <p className="text-slate-500 leading-relaxed text-base font-medium">
                {business?.description ||
                  "A premier destination for quality service and professional care. We specialize in providing a seamless experience for all our clients."}
              </p>
            </section>

            {/* Services List (No "Book Now" Button) */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-6">
                Services & Pricing
              </h2>
              <div className="space-y-3">
                {business?.services?.map((service: any) => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-xl hover:border-slate-200 hover:bg-slate-50/50 transition-all group"
                  >
                    <div>
                      <h3 className="font-semibold text-slate-900 group-hover:text-[#0be48d] transition-colors">
                        {service.service}
                      </h3>
                      <div className="flex items-center gap-4 mt-1.5">
                        <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                          <Timer size={14} className="text-slate-300" /> {service.durationMinutes} mins
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                        <span className="text-slate-900 font-bold text-lg flex items-center gap-0.5 justify-end">
                          <DollarSign size={16} /> {service.price}
                        </span>
                        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-tight">Available</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* WhatsApp Booking Sidebar */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 p-8 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <MessageCircle size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1 text-center">
                Book via WhatsApp
              </h3>
              <p className="text-xs font-medium text-slate-400 mb-8 text-center px-4">
                We accept bookings exclusively through WhatsApp. Scan the code to start.
              </p>
              
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex justify-center mb-8">
                <QRCodeSVG
                  value={whatsappUrl}
                  size={180}
                  level="M"
                  includeMargin={true}
                />
              </div>

              <div className="w-full space-y-3">
                <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100">
                    <Clock size={18} className="text-slate-400" />
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-0.5">Operating Hours</p>
                        <p className="text-sm font-semibold text-slate-700">{business?.openingTime} - {business?.closingTime}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100">
                    <Phone size={18} className="text-slate-400" />
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-0.5">Contact Support</p>
                        <p className="text-sm font-semibold text-slate-700">{business?.businessPhoneNumber}</p>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}