import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../contexts/Authcontext";
import { Clock, Store, MapPin, 
  Plus, Phone, Edit3, Trash2, 
  ChevronRight, Tag 
} from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const fetchBusinessByOwner = async (token: string | null) => {
  const response = await fetch(`${API_BASE_URL}/api/business/get-business-by-owner`, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Failed to fetch business");
  const data = await response.json();
  return Array.isArray(data) ? data[0] : data; 
};

function BusinessLoadingSkeleton() {
  return (
    <div className="max-w-7xl px-6 font-sans animate-in fade-in duration-500">
      <div className="mb-10">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>

      <div className="flex flex-col gap-8">
        {/* Profile Card Skeleton */}
        <section className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <Skeleton className="w-20 h-20 rounded-3xl shrink-0" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-7 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 mt-8 border-t border-slate-50">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
          </div>
        </section>

        {/* Services List Skeleton */}
        <section className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-10 w-28 rounded-xl" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-2xl" />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default function BusinessPage() {
  const { token } = useAuth();

  const { data: business, isLoading } = useQuery({
    queryKey: ["owner-business", token],
    queryFn: () => fetchBusinessByOwner(token),
    enabled: !!token,
  });


  // Use the Shimmer Effect during loading
  if (isLoading) return <BusinessLoadingSkeleton />;

  if (!business) return (
    <div className="h-[60vh] flex flex-col items-center justify-center text-slate-500 font-sans">
      <Store size={48} className="mb-4 opacity-20" />
      <p className="font-medium">No business found linked to your account.</p>
    </div>
  );

  return (
    <div className="max-w-7xl px-6 font-sans selection:bg-[#0be48d]/20 pb-20">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Manage your business</h1>
          <p className="text-sm text-slate-500">Review and update your business profile</p>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <section className="bg-white border border-slate-100 rounded-md p-8 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#0be48d] opacity-[0.03] blur-3xl -z-10 rounded-full"></div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center border border-slate-100 shrink-0 shadow-sm overflow-hidden transition-transform group-hover:scale-105 duration-300">
               {business.businessProfileImage ? (
                  <img src={business.businessProfileImage} className="w-full h-full object-cover" alt="Profile" />
               ) : (
                  <Store size={32} className="text-[#0be48d]" />
               )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-slate-900">{business.businessName}</h2>
                <Badge className="bg-emerald-50 text-emerald-600 border-none px-2 py-0 text-[9px] font-bold uppercase">Active</Badge>
              </div>
              <p className="text-sm text-slate-500 font-medium flex items-center gap-1.5">
                <MapPin size={14} className="text-slate-400" /> {business.businessAddress}
              </p>
            </div>

            <button className="md:ml-auto px-5 py-2.5 bg-slate-50 text-slate-900 border border-slate-200 rounded-xl text-xs font-bold hover:bg-white hover:shadow-sm transition-all flex items-center gap-2">
              Update Profile <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 mt-8 border-t border-slate-50">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/50">
              <Phone size={14} className="text-[#0be48d]" />
              <span className="text-sm font-semibold text-slate-600">{business.businessPhoneNumber}</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/50">
              <Clock size={14} className="text-[#0be48d]" />
              <span className="text-sm font-semibold text-slate-600">{business.openingTime} - {business.closingTime}</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/50">
              <Tag size={14} className="text-[#0be48d]" />
              <span className="text-sm font-semibold text-slate-600">{business.services?.length || 0} Services Offered</span>
            </div>
          </div>
        </section>

        <section className="bg-white border border-slate-100 rounded-md p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Current Offerings</h3>
              <p className="text-xs text-slate-400 font-medium">Add or edit the services your customers can book</p>
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-[#0be48d] text-slate-900 rounded-xl text-xs font-bold hover:shadow-lg hover:shadow-[#0be48d]/20 transition-all active:scale-95">
              <Plus size={16} /> Add New
            </button>
          </div>

          <div className="space-y-3">
            {business.services?.length > 0 ? (
              business.services.map((service: any) => (
                <div 
                  key={service.id} 
                  className="flex items-center justify-between p-5 bg-slate-50/50 border border-slate-100 rounded-2xl hover:bg-white hover:border-slate-200 hover:shadow-md hover:shadow-slate-200/20 transition-all group"
                >
                  <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center border border-slate-100 group-hover:bg-[#0be48d]/10 transition-colors">
                          <Tag size={16} className="text-slate-400 group-hover:text-[#0be48d]" />
                      </div>
                      <div>
                          <h4 className="text-sm font-bold text-slate-800">{service.service}</h4>
                          <p className="text-[11px] font-medium text-slate-400">
                            {service.durationMinutes} mins • <span className="text-slate-900 font-bold">${service.price}</span>
                          </p>
                      </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button className="p-2 text-slate-400 hover:text-slate-900 transition-all rounded-lg hover:bg-slate-100" title="Edit service">
                          <Edit3 size={16} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-500 transition-all rounded-lg hover:bg-red-50" title="Delete service">
                          <Trash2 size={16} />
                      </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center border-2 border-dashed border-slate-100 rounded-[32px]">
                <Tag size={24} className="text-slate-200 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-400">No services added yet</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}