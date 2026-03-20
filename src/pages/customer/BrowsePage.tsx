import { useState } from "react";
import { useQuery } from '@tanstack/react-query';
import { useAuth } from "../../contexts/Authcontext";
import { 
  LogOut, Search, MapPin, Clock, ChevronRight, 
  Store, Loader2, AlertCircle, LayoutGrid, 
  CalendarCheck, UserCircle, Bell
} from "lucide-react";
import { Link, NavLink } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
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

// Updated Navigation Items for Customer View
const navItems = [
  { icon: LayoutGrid, label: "Browse All", path: "/browse" },
  { icon: CalendarCheck, label: "Your Bookings", path: "/bookings" },
  { icon: UserCircle, label: "Profile", path: "/profile" },
];

export default function BrowsePage() {
    const { user, logout, token } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");

    const { data: businesses, isLoading, isError } = useQuery({
        queryKey: ['businesses'],
        queryFn: () => fetchBusinesses(token)
    });

    const initials = user?.displayName
        ? user.displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
        : "CU";

    const filteredBusinesses = businesses?.filter((b: any) => 
      b.businessName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      b.businessAddress.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    if (isLoading) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50">
                <Loader2 size={40} className="text-[#0be48d] animate-spin mb-4" />
                <p className="font-bold text-gray-500">Loading marketplace...</p>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
            {/* Sidebar Navigation */}
            <aside className="w-64 shrink-0 bg-white border-r border-gray-100 flex flex-col py-6 px-4 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-3 px-2 mb-10 mt-2">
                    <div className="w-9 h-9 bg-[#0be48d] rounded-xl flex items-center justify-center shadow-md shadow-[#0be48d]/20">
                        <Store size={18} className="text-white" />
                    </div>
                    <span className="font-extrabold text-black text-lg tracking-tight">BookingManager</span>
                </div>

                <nav className="flex-1 flex flex-col gap-2">
                    {navItems.map(({ icon: Icon, label, path }) => (
                        <NavLink
                            key={label}
                            to={path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm transition-all duration-200 ${
                                    isActive
                                        ? "bg-gray-100 text-black shadow-sm"
                                        : "text-gray-500 hover:text-black hover:bg-gray-50"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon size={16} />
                                    {label}
                                    {isActive && <ChevronRight size={14} className="ml-auto opacity-40" />}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* User Profile Section at Bottom */}
                <div className="border-t border-gray-100 pt-4 mt-4">
                    <div className="flex items-center gap-3 px-2 py-2">
                        <Avatar className="w-9 h-9 border border-gray-100 shadow-sm">
                            <AvatarImage src={user?.profileImage} />
                            <AvatarFallback className="bg-black text-white text-xs">{initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-black truncate">{user?.displayName || "Guest"}</p>
                            <p className="text-[10px] text-gray-400 font-bold tracking-wider truncate">{user?.email}</p>
                        </div>
                        <button onClick={logout} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto relative flex flex-col">
                {/* <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0be48d] opacity-[0.03] blur-[100px] rounded-full pointer-events-none -z-10"></div> */}

                {/* Header */}
                <header className="sticky top-0 z-10 bg-gray-50/80 backdrop-blur-md border-b border-gray-100 px-10 py-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-black tracking-tight">Browse All</h1>
                        <p className="text-sm text-gray-500 font-medium">Find and book local services instantly</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input 
                                type="text"
                                placeholder="Search businesses..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#0be48d]/20 focus:border-[#0be48d] transition-all w-64"
                            />
                        </div>
                    </div>
                </header>

                {/* Content Grid */}
                <div className="p-10">
                    {filteredBusinesses.length === 0 ? (
                        <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
                            <Search size={48} className="text-gray-200 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-black">No results found</h3>
                            <p className="text-gray-500">Try searching for something else.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredBusinesses.map((business: any) => (
                                <div key={business.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400">
                                            <Store size={24} color="black" />
                                        </div>
                                        <Badge className="bg-emerald-50 text-emerald-600 border-none hover:bg-emerald-100">Open</Badge>
                                    </div>
                                    
                                    <h3 className="text-lg font-bold text-black mb-1">{business.businessName}</h3>
                                    <div className="flex items-center gap-1.5 text-gray-400 text-sm mb-4">
                                        <MapPin size={14} />
                                        <span className="truncate">{business.businessAddress}</span>
                                    </div>

                                    <div className="pt-5 border-t border-gray-50 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                                            <Clock size={14} />
                                            {business.openingTime} - {business.closingTime}
                                        </div>
                                        <Link 
                                            to={`/business/${business.id}`} 
                                            className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center group-hover:bg-[#0be48d] group-hover:text-black transition-all shadow-md"
                                        >
                                            <ChevronRight size={20} />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}