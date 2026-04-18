import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../contexts/Authcontext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Users, CheckCircle2, MoreHorizontal, X, Clock3 } from "lucide-react";
import initials from "./utils/getCustomerInitials";
import waitTimeAgo from "./utils/getWaitTime";
import QueueSkeleton from "./utils/getQueueSkeleton";
import getTimeSlotRange from "./utils/getTimeSlotRange";
import {
  addWalkIn,
  fetchBusinessByOwner,
  fetchQueue,
  generateAvailableSlots,
} from "./api/queueApi";
import type { QueueEntry, ServiceItem, TimeSlot } from "./api/queueApi";

export default function QueuePage() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [isAddWalkInModalOpen, setIsAddWalkInModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "service">("details");
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [generatedSlots, setGeneratedSlots] = useState<TimeSlot[]>([]);
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTime(Date.now());
    }, 60_000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

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
  const currentServiceEntry = queue.find((entry) => entry.position === 1);
  const waitingCount = queue.filter((entry) => entry.position > 1).length;

  const getQueueStatusLabel = (position: number) => {
    if (position === 1) return "In service";
    if (position === 2) return "Up next";
    return "Waiting";
  };

  const handleCloseModal = () => {
    setIsAddWalkInModalOpen(false);
    setActiveTab("details");
    setCustomerName("");
    setPhoneNumber("");
    setSelectedServiceId("");
    setSelectedSlot(null);
    setGeneratedSlots([]);
  };

  const handleCreateWalkIn = () => {
    setGeneratedSlots([]);
    if (!customerName.trim() || !selectedServiceId || !selectedSlot) return;
    addWalkInMutation.mutate({
      customerName,
      phoneNumber,
      serviceId: selectedServiceId,
      slot: selectedSlot,
    });
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

  const addWalkInMutation = useMutation({
    mutationFn: async (walkInData: {
      customerName: string;
      phoneNumber: string;
      serviceId: string;
      slot: TimeSlot;
    }) => {
      if (!token) throw new Error("No token");
      return addWalkIn(token, walkInData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["queue", token] });
      handleCloseModal();
    },
    onError: (error: Error) => {
      alert(error.message);
    },
  });

  return (
    <div className="space-y-4">
      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="border border-gray-200 rounded-xl bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                <CheckCircle2 size={16} className="text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-gray-400 leading-none mb-1">
                  Currently in service
                </p>
                {isLoading ? (
                  <p className="text-2xl font-extrabold text-black tracking-tight leading-none">
                    —
                  </p>
                ) : currentServiceEntry ? (
                  <>
                    <p className="text-2xl font-extrabold text-black tracking-tight leading-none truncate">
                      {currentServiceEntry.booking.customer.displayName ??
                        "Walk-in"}
                    </p>
                    <p className="mt-1 text-xs text-gray-400 truncate">
                      {currentServiceEntry.booking.service.service} ·{" "}
                      {currentServiceEntry.booking.service.durationMinutes} min ·{" "}
                      <Clock3
                        size={12}
                        className="text-gray-400 inline-block align-[-2px]"
                      />{" "}
                      {getTimeSlotRange(
                        currentServiceEntry.booking.scheduledAt,
                        currentServiceEntry.booking.service.durationMinutes,
                      )}
                    </p>
                  </>
                ) : (
                  <p className="text-sm font-medium text-gray-500 leading-none">
                    No one is currently in service
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 rounded-xl bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                <Users size={16} className="text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-gray-400 leading-none mb-1">
                  In Queue
                </p>
                <p className="text-2xl font-extrabold text-black tracking-tight leading-none">
                  {isLoading ? "—" : waitingCount}
                </p>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 mt-2.5 ml-13">
              People waiting after the current service
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Queue List */}
      <Card className="border border-gray-200 rounded-xl bg-white shadow-sm">
        <CardHeader className="border-b border-gray-100 px-6 pt-6 pb-4 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-black">
            Up Next
          </CardTitle>
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
                <p className="text-sm font-medium text-gray-900">
                  Queue is empty
                </p>
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
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        index === 0
                          ? "bg-black text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {initials(entry.booking.customer.displayName)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black">
                        {entry.booking.customer.displayName ?? "Walk-in"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {entry.booking.service.service} ·{" "}
                        {entry.booking.service.durationMinutes} min ·{" "}
                        <Clock3
                          size={12}
                          className="text-gray-400 inline-block align-[-2px]"
                        />{" "}
                        {getTimeSlotRange(
                          entry.booking.scheduledAt,
                          entry.booking.service.durationMinutes,
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Right — status + actions */}
                  <div className="flex items-center gap-5">
                    <div className="hidden md:flex flex-col items-end gap-1">
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          entry.position === 1
                            ? "bg-emerald-100 border border-emerald-200 text-emerald-700"
                            : entry.position === 2
                              ? "bg-white border border-gray-200 text-gray-500"
                            : "bg-white border border-gray-200 text-gray-500"
                        }`}
                      >
                        {getQueueStatusLabel(entry.position)}
                      </span>
                      <span className="text-[10px] text-gray-300">
                        {waitTimeAgo(entry.joinedAt, currentTime)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
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
                <h3 className="text-lg font-semibold text-black">
                  Add walk-ins
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Create a walk-in queue entry
                </p>
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
                      onClick={() =>
                        generateSlotsMutation.mutate(selectedServiceId)
                      }
                      disabled={
                        !selectedServiceId || generateSlotsMutation.isPending
                      }
                      className="w-full rounded-lg bg-black px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {generateSlotsMutation.isPending
                        ? "Generating slots..."
                        : "Generate available slot"}
                    </button>

                    <div className="mt-3">
                      <p className="block text-xs font-medium text-gray-600 mb-2">
                        Available time slots
                      </p>
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
                              <div className="mt-1 text-[10px] opacity-70">
                                {slot.start}
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="col-span-full rounded-lg border border-dashed border-gray-200 px-3 py-6 text-center text-[11px] text-gray-400">
                            Generate slots for the selected service to view
                            availability.
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
                  disabled={
                    !customerName.trim() ||
                    !selectedServiceId ||
                    !selectedSlot ||
                    addWalkInMutation.isPending
                  }
                  className="px-4 py-2 rounded-lg bg-black text-white text-xs font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {addWalkInMutation.isPending ? "Adding..." : "Add to Queue"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
