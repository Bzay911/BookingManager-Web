import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../contexts/Authcontext";
// import { io, Socket } from "socket.io-client";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";
import { Users, Clock, CheckCircle2, MoreHorizontal } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// ── Types ──────────────────────────────────────────────────────────────────
interface QueueEntry {
  id: number;
  position: number;
  status: "WAITING" | "IN_PROGRESS" | "DONE";
  joinedAt: string;
  booking: {
    scheduledAt: string;
    customer: { displayName: string | null; phoneNumber: string | null };
    service:  { service: string | null; durationMinutes: number; price: number };
  };
}

// ── Fetch (same pattern as your BookingPage) ───────────────────────────────
const fetchQueue = async (token: string): Promise<QueueEntry[]> => {
  const res = await fetch(`${API_BASE_URL}/api/liveQueue/get-live-queue`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Failed to fetch queue");
  return res.json();
};

// ── Skeleton ───────────────────────────────────────────────────────────────
function QueueSkeleton() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <Skeleton className="w-9 h-9 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
      ))}
    </>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────
function initials(name: string | null) {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase();
}

function waitMins(joinedAt: string) {
  const diff = Math.floor((Date.now() - new Date(joinedAt).getTime()) / 60000);
  return diff < 1 ? "just now" : `${diff} min${diff > 1 ? "s" : ""}`;
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function QueuePage() {
  const { token } = useAuth();
  // const queryClient = useQueryClient();
  // const [socketConnected, setSocketConnected] = useState(false);

  // 1. Initial load via useQuery — exactly like your BookingPage
  const { data: queue = [], isLoading } = useQuery<QueueEntry[]>({
    queryKey: ["queue", token],
    queryFn: () => {
      if (!token) throw new Error("No token");
      return fetchQueue(token);
    },
    enabled: !!token,
  });

  // 2. Socket.io — takes over after initial load
  // useEffect(() => {
  //   if (!token || !user) return;

  //   const socket: Socket = io(API_BASE_URL, {
  //     auth: { token }, // optional: send token for socket auth
  //   });

  //   socket.on("connect", () => {
  //     setSocketConnected(true);
  //     // tell the server which business room to join
  //     // user.businessId comes from your auth context
  //     socket.emit("join:business", user.businessId);
  //   });

  //   socket.on("disconnect", () => setSocketConnected(false));

  //   // every time the server emits queue:updated, replace the cache
  //   socket.on("queue:updated", (updatedQueue: QueueEntry[]) => {
  //     queryClient.setQueryData(["queue", token], updatedQueue);
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, [token, user, queryClient]);

  return (
    <div className="space-y-4">

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border border-gray-200 rounded-xl bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Users size={16} className="text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-gray-400 leading-none mb-1">In Queue</p>
                <p className="text-2xl font-extrabold text-black tracking-tight leading-none">
                  {isLoading ? "—" : queue.length}
                </p>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 mt-2.5 ml-[3.25rem]">People currently waiting</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 rounded-xl bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Clock size={16} className="text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-gray-400 leading-none mb-1">Avg. Wait</p>
                <p className="text-2xl font-extrabold text-black tracking-tight leading-none">
                  {isLoading ? "—" : queue.length > 0
                    ? `${Math.round(queue.reduce((acc, e) => acc + Math.floor((Date.now() - new Date(e.joinedAt).getTime()) / 60000), 0) / queue.length)} min`
                    : "0 min"}
                </p>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 mt-2.5 ml-[3.25rem]">Average wait time today</p>
          </CardContent>
        </Card>
      </div>

      {/* Queue List */}
      <Card className="border border-gray-200 rounded-xl bg-white shadow-sm">
        <CardHeader className="border-b border-gray-100 px-6 pt-6 pb-4 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-black">Up Next</CardTitle>
          <button className="text-xs font-medium text-white bg-black hover:bg-gray-800 px-4 py-2 rounded-lg transition-colors">
            + Add to Queue
          </button>
        </CardHeader>

        <CardContent className="p-0">
          <div className="divide-y divide-gray-50">
            {isLoading ? (
              <QueueSkeleton />
            ) : queue.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 opacity-30">
                <Users size={36} className="mb-3 text-gray-400" />
                <p className="text-sm font-medium text-gray-900">Queue is empty</p>
                <p className="text-xs text-gray-500">
                  New bookings will appear here automatically
                </p>
              </div>
            ) : (
              queue.map((entry, index) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50/50 transition-colors"
                >
                  {/* Left — avatar + name */}
                  <div className="flex items-center gap-3.5">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      index === 0
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {initials(entry.booking.customer.displayName)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black">
                        {entry.booking.customer.displayName ?? "Walk-in"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {entry.booking.service.service} · {entry.booking.service.durationMinutes} min
                      </p>
                    </div>
                  </div>

                  {/* Right — status + actions */}
                  <div className="flex items-center gap-5">
                    <div className="hidden md:flex flex-col items-end gap-1">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        index === 0
                          ? "bg-black/5 border border-black/10 text-black"
                          : "bg-white border border-gray-200 text-gray-500"
                      }`}>
                        {index === 0 ? "Next up" : "Waiting"}
                      </span>
                      <span className="text-[10px] text-gray-300">
                        {waitMins(entry.joinedAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {index === 0 && (
                        <button className="w-8 h-8 rounded-lg bg-black text-white hover:bg-gray-800 flex items-center justify-center transition-colors">
                          <CheckCircle2 size={14} />
                        </button>
                      )}
                      <button className="w-8 h-8 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-black flex items-center justify-center transition-colors">
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
