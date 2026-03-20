import { useState, useMemo } from "react";
import { useQuery } from '@tanstack/react-query';
import { useAuth } from "../../contexts/Authcontext";
import { 
  Search, MapPin, Clock, Store, Loader2, 
  ChevronRight, SlidersHorizontal 
} from "lucide-react";
import { Link } from 'react-router-dom';
import { Badge } from "../../components/ui/badge";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const fetchBusinesses = async (token: string | null) => {
    const response = await fetch(`${API_BASE_URL}/api/business/get-all-businesses`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    });
    
    if (!response.ok) throw new Error('Failed to fetch businesses');
    const data = await response.json();
    return data.businesses || data; 
};

// Standard booking categories
const categories = ["All Services", "Barber", "Mechanic", "Beauty", "Health", "Automotive", "Cleaning"];

export default function BrowsePage() {
    const { token } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All Services");

    const { data: businesses, isLoading } = useQuery({
        queryKey: ['businesses', token],
        queryFn: () => fetchBusinesses(token),
        enabled: !!token
    });

    // Memoized filtering logic for performance
    const filteredBusinesses = useMemo(() => {
        if (!businesses) return [];
        
        return businesses.filter((b: any) => {
            const matchesSearch = 
                b.businessName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                b.businessAddress.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesCategory = 
                activeCategory === "All Services" || 
                b.category?.toLowerCase() === activeCategory.toLowerCase();

            return matchesSearch && matchesCategory;
        });
    }, [businesses, searchQuery, activeCategory]);

    if (isLoading) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
                <Loader2 size={40} className="text-[#0be48d] animate-spin mb-4" />
                <p className="font-bold text-gray-400 tracking-tight">Loading BookingManager...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            {/* --- HEADER NAVIGATION --- */}
            <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
                    
                    {/* Brand Logo */}
                    <Link to="/" className="flex items-center gap-2.5 shrink-0">
                        <div className="w-9 h-9 bg-[#0be48d] rounded-xl flex items-center justify-center shadow-sm">
                            <Store size={20} className="text-white" />
                        </div>
                        <span className="font-black text-xl tracking-tighter">BookingManager</span>
                    </Link>

                    {/* Right Aligned Search Bar */}
                    <div className="flex-1 flex justify-end">
                        <div className="relative w-full max-w-sm group">
                            <Search 
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0be48d] transition-colors" 
                                size={18} 
                            />
                            <input 
                                type="text"
                                placeholder="Search services or locations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-12 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#0be48d]/10 focus:border-[#0be48d] transition-all"
                            />
                            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">
                                <SlidersHorizontal size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* --- CENTERED CHIPS --- */}
            <div className="sticky top-20 z-40 bg-white border-b border-gray-50 py-4">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-center gap-3 overflow-x-auto no-scrollbar">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-2 rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap ${
                                    activeCategory === cat 
                                    ? "bg-black text-white shadow-lg scale-105" 
                                    : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-black"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- MAIN GRID --- */}
            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight">Discover</h2>
                        <p className="text-gray-400 text-sm font-medium mt-1">
                            Showing {filteredBusinesses.length} results for {activeCategory}
                        </p>
                    </div>
                </div>

                {filteredBusinesses.length === 0 ? (
                    <div className="py-24 text-center bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <Search size={24} className="text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">No matches found</h3>
                        <p className="text-gray-500 text-sm mt-1">Try searching for a different keyword or category.</p>
                        <button 
                            onClick={() => {setSearchQuery(""); setActiveCategory("All Services");}}
                            className="mt-6 text-sm font-bold text-[#0be48d] hover:underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                        {filteredBusinesses.map((business: any) => (
                            <Link 
                                key={business.id} 
                                to={`/business/${business.id}`}
                                className="group cursor-pointer"
                            >
                                {/* Card Image Container */}
                                <div className="relative aspect-[1.1] rounded-[32px] bg-slate-100 overflow-hidden mb-4 shadow-sm group-hover:shadow-xl transition-all duration-500">
                                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                                        <Store size={48} className="text-slate-200 group-hover:scale-110 transition-transform duration-700 ease-out" />
                                    </div>
                                    
                                    {/* Status Badge Overlay */}
                                    <div className="absolute top-4 left-4">
                                        <Badge className="bg-white/90 backdrop-blur-md text-emerald-600 border-none font-bold text-[10px] px-2.5 py-1 rounded-lg">
                                            OPEN NOW
                                        </Badge>
                                    </div>
                                </div>
                                
                                {/* Card Text Content */}
                                <div className="px-1">
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="font-bold text-[17px] leading-tight group-hover:text-[#0be48d] transition-colors line-clamp-1">
                                            {business.businessName}
                                        </h3>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <span className="text-xs font-bold">4.8</span>
                                            <span className="text-yellow-400">★</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-1.5 text-gray-400 text-sm mt-1 mb-3">
                                        <MapPin size={14} className="shrink-0" />
                                        <span className="truncate">{business.businessAddress}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl">
                                            <Clock size={13} className="text-[#0be48d]" />
                                            <span className="text-[11px] font-bold text-slate-600">
                                                {business.openingTime} - {business.closingTime}
                                            </span>
                                        </div>
                                        <div className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                                            <ChevronRight size={16} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}