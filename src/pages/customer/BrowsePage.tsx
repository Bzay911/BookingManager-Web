import { useState } from "react";
import { useQuery } from '@tanstack/react-query';
import { useAuth } from "../../contexts/Authcontext";
import { 
  LogOut, Search, MapPin, Clock, ChevronRight, 
  Store, Loader2, AlertCircle 
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL;


const fetchBusinesses = async (token: string | null) => {
    const response = await fetch(`${API_BASE_URL}/api/business/get-all-businesses`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    });
    
    if (!response.ok) {
        throw new Error('Failed to fetch businesses');
    }
    // Assuming the API returns the array directly, or inside a data object. 
    // Adjust this if your backend wraps it like { businesses: [...] }
    const data = await response.json();
    return data.businesses || data; 
};

export default function BrowsePage() {
    const { user, logout, token } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");

    const { data: businesses, isLoading, isError } = useQuery({
        queryKey: ['businesses'],
        queryFn: () => fetchBusinesses(token)
    });

    // Filter businesses based on search
    const filteredBusinesses = businesses?.filter(b => 
      b.businessName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      b.businessAddress.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    // --- LOADING STATE ---
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-sans">
                <div className="w-16 h-16 bg-[#0be48d]/10 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-[#0be48d]/20 relative overflow-hidden">
                    <Loader2 size={32} className="text-[#0be48d] animate-spin" />
                </div>
                <h2 className="text-xl font-extrabold text-black tracking-tight">Finding businesses...</h2>
            </div>
        );
    }

    // --- ERROR STATE ---
    if (isError) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-sans p-6">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-red-100 text-center max-w-md">
                    <AlertCircle size={40} className="text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-extrabold text-black tracking-tight mb-2">Oops! Something broke.</h2>
                    <p className="text-gray-500 font-medium mb-6">We couldn't load the businesses right now. Please try again later.</p>
                    <button onClick={() => window.location.reload()} className="bg-black text-white px-6 py-3 rounded-full font-bold hover:bg-[#0be48d] hover:text-black transition-colors">
                        Refresh Page
                    </button>
                </div>
            </div>
        );
    }

    // --- MAIN RENDER ---
    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-20">
            
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#0be48d] rounded-lg flex items-center justify-center shadow-md shadow-[#0be48d]/20">
                        <Store size={16} className="text-white" />
                    </div>
                    <span className="font-extrabold text-black text-lg tracking-tight hidden sm:block">BookingManager</span>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</p>
                        <p className="text-sm font-extrabold text-black">{user?.displayName || "Guest"}</p>
                    </div>
                    <div className="h-8 w-px bg-gray-200 mx-2 hidden sm:block"></div>
                    <button 
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors" 
                        onClick={logout}
                        title="Log out"
                    >
                        <LogOut size={16} />
                        <span className="hidden sm:block">Log out</span>
                    </button>
                </div>
            </header>

            {/* Hero / Search Section */}
            <div className="relative overflow-hidden bg-white border-b border-gray-100 px-6 py-12 md:py-16 mb-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#0be48d] opacity-[0.05] blur-[100px] rounded-full pointer-events-none"></div>
                
                <div className="max-w-5xl mx-auto relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-black tracking-tight mb-4">
                        Find your next{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0be48d] to-emerald-400">
                            appointment.
                        </span>
                    </h1>
                    <p className="text-gray-500 text-lg font-medium max-w-xl mx-auto mb-10">
                        Discover local businesses, join their live queues, and book services instantly via WhatsApp.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto relative group">
                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                            <Search size={22} className="text-gray-400 group-focus-within:text-[#0be48d] transition-colors" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for barbers, bakers, mechanics..."
                            className="w-full pl-14 pr-6 py-5 rounded-full border-2 border-gray-100 bg-gray-50 text-black font-bold placeholder:text-gray-400 focus:bg-white focus:border-[#0be48d] focus:ring-4 focus:ring-[#0be48d]/10 transition-all outline-none text-lg shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Business Grid */}
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-extrabold text-black tracking-tight">Available Businesses</h2>
                    <span className="text-sm font-bold text-[#0be48d] bg-[#0be48d]/10 px-3 py-1 rounded-full">
                        {filteredBusinesses.length} found
                    </span>
                </div>

                {filteredBusinesses.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                            <Search size={32} className="text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-black mb-2">No businesses found</h3>
                        <p className="text-gray-500 font-medium">Try adjusting your search terms or checking back later.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredBusinesses.map((business) => (
                            <div 
                                key={business.id} 
                                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[#0be48d]/30 transition-all duration-300 group flex flex-col"
                            >
                                {/* Card Header */}
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 text-gray-400 group-hover:bg-[#0be48d]/10 group-hover:text-[#0be48d] group-hover:border-[#0be48d]/20 transition-colors">
                                        <Store size={24} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-bold text-black truncate" title={business.businessName}>
                                            {business.businessName}
                                        </h3>
                                        {/* Address */}
                                        <div className="flex items-center gap-1.5 text-gray-500 mt-1">
                                            <MapPin size={14} className="flex-shrink-0" />
                                            <span className="text-xs font-medium truncate">{business.businessAddress}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-sm text-gray-500 font-medium line-clamp-2 mb-6 flex-1">
                                    {business.description || "No description provided."}
                                </p>

                                {/* Footer details & Action */}
                                <div className="pt-5 border-t border-gray-50 flex items-center justify-between mt-auto">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full">
                                        <Clock size={14} className="text-black" />
                                        {business.openingTime} - {business.closingTime}
                                    </div>
                                    
                                    <button className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center group-hover:bg-[#0be48d] group-hover:text-black transition-colors shadow-md">
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}