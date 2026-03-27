import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../contexts/Authcontext";
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
} from "../../../components/ui/table";
import { Badge } from "../../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Skeleton } from "../../../components/ui/skeleton";

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
        <TableRow key={i} className="border-gray-50 hover:bg-transparent">
          <TableCell className="py-4 pl-6">
            <div className="flex items-center gap-3">
              <Skeleton className="w-9 h-9 rounded-full" />
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-20" />
                <Skeleton className="h-3 w-28" />
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-3 w-14" />
            </div>
          </TableCell>
          <TableCell>
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-16" />
              <Skeleton className="h-3 w-10" />
            </div>
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-14 rounded-full" />
          </TableCell>
          <TableCell className="text-right pr-6">
            <Skeleton className="h-7 w-7 rounded-lg ml-auto" />
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
            size={14}
          />
          <input
            type="text"
            placeholder="Search customers..."
            className="
              pl-9 pr-4 py-2 
              bg-white 
              border border-gray-200 
              rounded-lg text-xs 
              placeholder:text-gray-400
              shadow-sm
              focus:outline-none 
              focus:ring-2 focus:ring-black/5 
              focus:border-gray-300 
              transition-all duration-200
              w-72
            "
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="hover:bg-transparent border-gray-100">
              <TableHead className="py-3.5 font-medium text-gray-400 text-[10px] uppercase tracking-wider pl-6">
                Customer
              </TableHead>
              <TableHead className="py-3.5 font-medium text-gray-400 text-[10px] uppercase tracking-wider">
                Service
              </TableHead>
              <TableHead className="py-3.5 font-medium text-gray-400 text-[10px] uppercase tracking-wider">
                Schedule
              </TableHead>
              <TableHead className="py-3.5 font-medium text-gray-400 text-[10px] uppercase tracking-wider">
                Status
              </TableHead>
              <TableHead className="py-3.5 font-medium text-gray-400 text-[10px] uppercase tracking-wider text-right pr-6">
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
                  className="border-gray-50 hover:bg-gray-50/40 transition-colors group"
                >
                  <TableCell className="py-3.5 pl-6">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-9 h-9 border border-gray-100">
                        <AvatarFallback className="bg-black text-white text-[10px] uppercase font-bold">
                          {booking.customer?.displayName
                            ?.split(" ")
                            .map((n: any) => n[0])
                            .join("") || "C"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-black">
                          {booking.customer?.displayName}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {booking.customer?.phoneNumber}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-black">
                        {booking.service?.service}
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-medium text-gray-500 flex items-center">
                          <DollarSign size={9} strokeWidth={2.5} />{" "}
                          {booking.service?.price}
                        </span>
                        <span className="text-gray-200">·</span>
                        <span className="text-[10px] text-gray-400">
                          {booking.service?.durationMinutes} mins
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-black">
                        {formatDate(booking.scheduledAt)}
                      </span>
                      <span className="text-[10px] text-gray-400 mt-0.5">
                        {formatTime(booking.scheduledAt)}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium border-none shadow-none ${
                        booking.status === "PENDING"
                          ? "bg-amber-50 text-amber-600"
                          : "bg-black/5 text-black"
                      }`}
                    >
                      {booking.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right pr-6">
                    <button className="p-1.5 text-gray-300 hover:text-black transition-colors rounded-lg hover:bg-gray-100">
                      <MoreHorizontal size={14} />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-52 text-center">
                  <div className="flex flex-col items-center justify-center opacity-30">
                    <Calendar size={36} className="mb-3 text-gray-400" />
                    <p className="text-sm font-medium text-gray-900">
                      No appointments scheduled
                    </p>
                    <p className="text-xs text-gray-500">
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