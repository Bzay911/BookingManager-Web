import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../contexts/Authcontext";
// import { io, Socket } from "socket.io-client";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";
import { Users, Clock, CheckCircle2, MoreHorizontal, X } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL;

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

interface ServiceItem {
  id: string | number;
  service: string;
  price: number;
  durationMinutes: number;
}

interface TimeSlot {
  start: string;
  end: string;
  label: string;
}

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

const fetchBusinessByOwner = async (token: string) => {
  const response = await fetch(
    `${API_BASE_URL}/api/business/get-business-by-owner`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) throw new Error("Failed to fetch business");
  const data = await response.json();
  return Array.isArray(data) ? data[0] : data;
};

const generateAvailableSlots = async (token: string, serviceId: string): Promise<TimeSlot[]> => {
  const response = await fetch(
    `${API_BASE_URL}/api/business/get-available-slots/${serviceId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) throw new Error("Failed to generate available slots");

  const data = await response.json();
  return Array.isArray(data) ? data : Array.isArray(data?.slots) ? data.slots : [];
};

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

function initials(name: string | null) {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase();
}

function waitMins(joinedAt: string, currentTime: number) {
  const diff = Math.floor((currentTime - new Date(joinedAt).getTime()) / 60000);
  return diff < 1 ? "just now" : `${diff} min${diff > 1 ? "s" : ""}`;
}

export default function QueuePage() {
  const { token } = useAuth();
  const [isAddWalkInModalOpen, setIsAddWalkInModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "service">("details");
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [generatedSlots, setGeneratedSlots] = useState<TimeSlot[]>([]);
  const [currentTime] = useState(() => Date.now());
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

  const { data: business } = useQuery({
    queryKey: ["owner-business", token],
    queryFn: () => {
      if (!token) throw new Error("No token");
      return fetchBusinessByOwner(token);
    },
    enabled: !!token,
  });

  const services: ServiceItem[] = (business?.services || []) as ServiceItem[];

  const handleCloseModal = () => {
    setIsAddWalkInModalOpen(false);
    setActiveTab("details");
    setCustomerName("");
    setPhoneNumber("");
    setSelectedServiceId("");
    setSelectedSlot(null);
  };

  const handleCreateWalkIn = () => {
    if (!customerName.trim() || !selectedServiceId || !selectedSlot) return;
    // TODO: Wire up API call to create walk-in with:
    // - customerName, phoneNumber
    // - selectedServiceId
    // - selectedSlot (contains start, end, label)
    console.log({
      customerName,
      phoneNumber,
      serviceId: selectedServiceId,
      slot: {
        label: selectedSlot.label,
        start: selectedSlot.start,
        end: selectedSlot.end,
      },
    });
    handleCloseModal();
  };

  const generateSlotsMutation = useMutation({
    mutationFn: async (serviceId: string) => {
      if (!token) throw new Error("No token");
      return generateAvailableSlots(token, serviceId);
    },
    onSuccess: (slots: TimeSlot[]) => {
      setGeneratedSlots(slots);
      setSelectedSlot(null);
    },
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
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                <Users size={16} className="text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-gray-400 leading-none mb-1">In Queue</p>
                <p className="text-2xl font-extrabold text-black tracking-tight leading-none">
                  {isLoading ? "—" : queue.length}
                </p>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 mt-2.5 ml-13">People currently waiting</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 rounded-xl bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                <Clock size={16} className="text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-gray-400 leading-none mb-1">Avg. Wait</p>
                <p className="text-2xl font-extrabold text-black tracking-tight leading-none">
                  {isLoading ? "—" : queue.length > 0
                    ? `${Math.round(queue.reduce((acc, e) => acc + Math.floor((currentTime - new Date(e.joinedAt).getTime()) / 60000), 0) / queue.length)} min`
                    : "0 min"}
                </p>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 mt-2.5 ml-13">Average wait time today</p>
          </CardContent>
        </Card>
      </div>

      {/* Queue List */}
      <Card className="border border-gray-200 rounded-xl bg-white shadow-sm">
        <CardHeader className="border-b border-gray-100 px-6 pt-6 pb-4 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-black">Up Next</CardTitle>
          <button
            onClick={() => setIsAddWalkInModalOpen(true)}
            className="text-xs font-medium text-white bg-black hover:bg-gray-800 px-4 py-2 rounded-lg transition-colors"
          >
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
                        {waitMins(entry.joinedAt, currentTime)}
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

      {isAddWalkInModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px] flex items-center justify-center p-4"
          onClick={handleCloseModal}
        >
          <div
            className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-semibold text-black">Add walk-ins</h3>
                <p className="text-xs text-gray-400 mt-1">Create a walk-in queue entry</p>
              </div>
              <button
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-lg text-gray-400 hover:text-black hover:bg-gray-100 flex items-center justify-center transition-colors"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            <div className="px-6 pt-4">
              <div className="grid grid-cols-2 rounded-lg bg-gray-50 p-1 border border-gray-100">
                <button
                  type="button"
                  onClick={() => setActiveTab("details")}
                  className={`rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                    activeTab === "details"
                      ? "bg-white text-black shadow-sm"
                      : "text-gray-500 hover:text-black"
                  }`}
                >
                  Details
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("service")}
                  className={`rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                    activeTab === "service"
                      ? "bg-white text-black shadow-sm"
                      : "text-gray-500 hover:text-black"
                  }`}
                >
                  Service
                </button>
              </div>
            </div>

            <div className="px-6 py-5 space-y-4">
              {activeTab === "details" ? (
                <>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      Customer name
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter customer name"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      Phone number (optional)
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter phone number"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      Select service
                    </label>
                    <select
                      value={selectedServiceId}
                      onChange={(e) => setSelectedServiceId(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
                    >
                      <option value="">Choose a service</option>
                      {services.map((service) => (
                        <option key={service.id} value={String(service.id)}>
                          {service.service} ({service.durationMinutes} min)
                        </option>
                      ))}
                    </select>
                    {services.length === 0 && (
                      <p className="text-[11px] text-gray-400 mt-2">
                        No services found for this business yet.
                      </p>
                    )}
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => generateSlotsMutation.mutate(selectedServiceId)}
                      disabled={!selectedServiceId || generateSlotsMutation.isPending}
                      className="w-full rounded-lg bg-black px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {generateSlotsMutation.isPending ? "Generating slots..." : "Generate available slot"}
                    </button>

                    <div className="mt-3">
                      <p className="block text-xs font-medium text-gray-600 mb-2">Available time slots</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
                        {generatedSlots.length > 0 ? (
                          generatedSlots.map((slot) => (
                            <button
                              key={`${slot.start}-${slot.end}`}
                              type="button"
                              onClick={() => setSelectedSlot(slot)}
                              className={`rounded-lg border px-3 py-3 text-left text-xs font-medium transition-colors ${
                                selectedSlot?.start === slot.start
                                  ? "border-black bg-black text-white"
                                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-black"
                              }`}
                            >
                              <div className="font-medium">{slot.label}</div>
                              <div className="mt-1 text-[10px] opacity-70">{slot.start}</div>
                            </button>
                          ))
                        ) : (
                          <div className="col-span-full rounded-lg border border-dashed border-gray-200 px-3 py-6 text-center text-[11px] text-gray-400">
                            Generate slots for the selected service to view availability.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="px-6 pb-6 pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:text-black hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>

              {activeTab === "details" ? (
                <button
                  type="button"
                  onClick={() => setActiveTab("service")}
                  disabled={!customerName.trim()}
                  className="px-4 py-2 rounded-lg bg-black text-white text-xs font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCreateWalkIn}
                  disabled={!customerName.trim() || !selectedServiceId || !selectedSlot}
                  className="px-4 py-2 rounded-lg bg-black text-white text-xs font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add to Queue
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
