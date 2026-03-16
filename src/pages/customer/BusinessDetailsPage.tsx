import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../contexts/Authcontext";
import { 
  ArrowLeft, MapPin, Clock, Phone, Mail, 
  Store, Loader2, AlertCircle, DollarSign, Timer, ChevronRight 
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Function to fetch a single business by its ID
const fetchBusinessDetails = async (id: string, token: string | null) => {
    // Note: You will need to make sure this endpoint exists in your backend!
    const response = await fetch(`${API_BASE_URL}/api/business/get-business/${id}`, {
        headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
         }
    });
    if (!response.ok) throw new Error("Failed to fetch business details");
    return response.json();
};

export default function BusinessDetailsPage() {
    const { id } = useParams<{ id: string }>(); // Grabs the ID from the URL!
    const navigate = useNavigate();
    const { token } = useAuth();

    const { data: business, isLoading, isError } = useQuery({
        queryKey: ['business', id],
        queryFn: () => fetchBusinessDetails(id as string, token),
        enabled: !!id // Only run the query if we actually have an ID
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-sans">
                <div className="w-16 h-16 bg-[#0be48d]/10 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-[#0be48d]/20 relative overflow-hidden">
                    <Loader2 size={32} className="text-[#0be48d] animate-spin" />
                </div>
            </div>
        );
    }

    if (isError || !business) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-sans p-6">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-red-100 text-center max-w-md">
                    <AlertCircle size={40} className="text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-extrabold text-black mb-2">Business not found</h2>
                    <button onClick={() => navigate('/browse')} className="bg-black text-white px-6 py-3 rounded-full font-bold hover:bg-[#0be48d] transition-colors mt-4">
                        Go back to browse
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-24 relative overflow-hidden">
            
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#0be48d] opacity-[0.06] blur-[120px] rounded-full pointer-events-none"></div>

            {/* Top Navigation */}
            <header className="sticky top-0 z-20 bg-gray-50/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-gray-100">
                <button 
                    onClick={() => navigate(-1)} // Takes them back to the previous page
                    className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-black hover:border-black transition-colors shadow-sm"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="font-extrabold text-black tracking-tight bg-white px-4 py-1.5 rounded-full border border-gray-100 shadow-sm text-sm">
                    Business Profile
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-6 mt-8 relative z-10">
                
                {/* Business Header Card */}
                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-24 h-24 bg-gray-50 border-2 border-gray-100 rounded-3xl flex items-center justify-center flex-shrink-0 text-gray-300 shadow-inner">
                        <Store size={40} />
                    </div>
                    
                    <div className="flex-1">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-black tracking-tight mb-4">
                            {business.businessName}
                        </h1>
                        <p className="text-gray-500 text-lg font-medium leading-relaxed mb-6">
                            {business.description || "No description provided by the business."}
                        </p>
                        
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-100 text-sm font-bold text-gray-600">
                                <MapPin size={16} className="text-[#0be48d]" />
                                {business.businessAddress}
                            </div>
                            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-100 text-sm font-bold text-gray-600">
                                <Clock size={16} className="text-[#0be48d]" />
                                {business.openingTime} - {business.closingTime}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Services Section */}
                <h2 className="text-2xl font-extrabold text-black tracking-tight mb-6 ml-4">
                    Available Services
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {business.services && business.services.length > 0 ? (
                        business.services.map((service: any) => (
                            <div key={service.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:border-[#0be48d]/40 hover:shadow-md transition-all group flex flex-col justify-between h-full">
                                <div>
                                    <h3 className="text-xl font-bold text-black mb-3">{service.serviceName}</h3>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="flex items-center gap-1.5 text-sm font-bold text-gray-600 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                                            <DollarSign size={16} className="text-[#0be48d]" />
                                            {service.price}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-sm font-bold text-gray-600 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                                            <Timer size={16} className="text-[#0be48d]" />
                                            {service.durationMinutes} mins
                                        </div>
                                    </div>
                                </div>
                                
                                <button className="w-full py-4 rounded-2xl bg-black text-white font-bold flex items-center justify-center gap-2 group-hover:bg-[#0be48d] group-hover:text-black transition-colors">
                                    Join Queue <ChevronRight size={18} />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full bg-white p-8 rounded-3xl border border-dashed border-gray-200 text-center">
                            <p className="text-gray-500 font-medium">This business hasn't listed any services yet.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}