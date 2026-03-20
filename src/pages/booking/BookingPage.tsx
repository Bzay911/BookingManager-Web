import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../contexts/Authcontext";
import {
  Calendar,
  MoreHorizontal,
  Search,
  DollarSign,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Skeleton } from "../../components/ui/skeleton";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const fetchBookings = async (token: string) => {
  const response = await fetch(
    `${API_BASE_URL}/api/bookings/get-all-bookings`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );
  if (!response.ok) throw new Error("Failed to fetch bookings");
  const data = await response.json();
  return data.bookings || data;
};

// --- SHIMMER SKELETON FOR TABLE ROWS ---
function TableLoadingSkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <TableRow key={i} className="border-slate-50 hover:bg-transparent">
          <TableCell className="py-5 pl-8">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-16" />
            </div>
          </TableCell>
          <TableCell>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-12" />
            </div>
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-16 rounded-lg" />
          </TableCell>
          <TableCell className="text-right pr-8">
            <Skeleton className="h-8 w-8 rounded-full ml-auto" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export default function BookingPage() {
  const { token } = useAuth();

  const { data: bookings, isLoading: loadingBookings } = useQuery({
    queryKey: ["bookings", token],
    queryFn: () => {
      if (!token) throw new Error("No auth token found");
      return fetchBookings(token);
    },
    enabled: !!token,
  });

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-AU", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    
  const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString("en-AU", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  return (
    <div className="max-w-7xl px-6 font-sans selection:bg-[#0be48d]/20 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 animate-in fade-in duration-500">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Manage your bookings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review and manage your upcoming customer appointments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0be48d] transition-colors"
              size={16}
            />
            <input
              type="text"
              placeholder="Search customers..."
              className="
                pl-10 pr-4 py-2.5 
                bg-white 
                border-2 border-slate-200 
                rounded-xl text-sm 
                placeholder:text-slate-400
                shadow-[0_8px_30px_rgb(0,0,0,0.04)] 
                focus:outline-none 
                focus:ring-4 focus:ring-[#0be48d]/10 
                focus:border-[#0be48d] 
                transition-all duration-300
                w-80
              "
            />
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white border border-slate-100 rounded-md overflow-hidden shadow-sm transition-all animate-in slide-in-from-bottom-2 duration-700">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="py-5 font-bold text-slate-700 text-xs uppercase tracking-wider pl-8">
                Customer
              </TableHead>
              <TableHead className="py-5 font-bold text-slate-700 text-xs uppercase tracking-wider">
                Service Requested
              </TableHead>
              <TableHead className="py-5 font-bold text-slate-700 text-xs uppercase tracking-wider">
                Schedule
              </TableHead>
              <TableHead className="py-5 font-bold text-slate-700 text-xs uppercase tracking-wider">
                Status
              </TableHead>
              <TableHead className="py-5 font-bold text-slate-700 text-xs uppercase tracking-wider text-right pr-8">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loadingBookings ? (
              <TableLoadingSkeleton />
            ) : bookings && bookings.length > 0 ? (
              bookings.map((booking: any) => (
                <TableRow
                  key={booking.id}
                  className="border-slate-50 hover:bg-slate-50/40 transition-colors group"
                >
                  <TableCell className="py-5 pl-8">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 border border-white shadow-sm">
                        <AvatarFallback className="bg-black text-white text-[10px] uppercase font-bold">
                          {booking.customer?.displayName
                            ?.split(" ")
                            .map((n: any) => n[0])
                            .join("") || "C"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-900">
                          {booking.customer?.displayName}
                        </span>
                        <span className="text-[11px] font-medium text-slate-400">
                          {booking.customer?.phoneNumber}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-700">
                        {booking.service?.service}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-bold text-emerald-600 flex items-center">
                          <DollarSign size={10} strokeWidth={3} />{" "}
                          {booking.service?.price}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-[11px] font-medium text-slate-400">
                          {booking.service?.durationMinutes} mins
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col text-xs">
                      <span className="font-semibold text-slate-700">
                        {formatDate(booking.scheduledAt)}
                      </span>
                      <span className="text-slate-400 mt-0.5">
                        {formatTime(booking.scheduledAt)}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      className={`rounded-lg px-2.5 py-1 text-[10px] font-bold border-none shadow-none ${
                        booking.status === "PENDING"
                          ? "bg-amber-50 text-amber-600"
                          : "bg-emerald-50 text-emerald-600"
                      }`}
                    >
                      {booking.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right pr-8">
                    <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors rounded-full hover:bg-slate-100">
                      <MoreHorizontal size={18} />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center opacity-30">
                    <Calendar size={48} className="mb-4 text-slate-400" />
                    <p className="text-sm font-bold text-slate-900">
                      No appointments scheduled
                    </p>
                    <p className="text-xs font-medium">
                      New bookings will appear here automatically.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}