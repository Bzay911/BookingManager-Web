import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../contexts/Authcontext";
import {
  Clock,
  Store,
  MapPin,
  Plus,
  Phone,
  Edit3,
  Trash2,
  ChevronRight,
  Tag,
} from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Skeleton } from "../../../components/ui/skeleton";

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface ServiceItem {
  id: string | number;
  service: string;
  price: number;
  durationMinutes: number;
}

const fetchBusinessByOwner = async (token: string | null) => {
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

function BusinessLoadingSkeleton() {
  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <Skeleton className="w-14 h-14 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-3.5 w-1/2" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-5 mt-5 border-t border-gray-100">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      </section>
    </div>
  );
}

export default function BusinessPage() {
  const { token } = useAuth();
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  const [serviceName, setServiceName] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [serviceDurationMinutes, setServiceDurationMinutes] = useState("");
  const [addedServices, setAddedServices] = useState<ServiceItem[]>([]);

  const { data: business, isLoading } = useQuery({
    queryKey: ["owner-business", token],
    queryFn: () => fetchBusinessByOwner(token),
    enabled: !!token,
  });

  const displayedServices: ServiceItem[] = [
    ...((business?.services || []) as ServiceItem[]),
    ...addedServices,
  ];

  const handleAddService = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!serviceName.trim() || !servicePrice.trim() || !serviceDurationMinutes.trim()) {
      return;
    }

    const parsedPrice = Number(servicePrice);
    const parsedDuration = Number(serviceDurationMinutes);

    if (Number.isNaN(parsedPrice) || Number.isNaN(parsedDuration)) {
      return;
    }

    setAddedServices((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        service: serviceName.trim(),
        price: parsedPrice,
        durationMinutes: parsedDuration,
      },
    ]);

    setServiceName("");
    setServicePrice("");
    setServiceDurationMinutes("");
    setIsAddServiceModalOpen(false);
  };

  // Use the Shimmer Effect during loading
  if (isLoading) return <BusinessLoadingSkeleton />;

  if (!business)
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-gray-500">
        <Store size={36} className="mb-3 opacity-20" />
        <p className="text-sm font-medium">No business found linked to your account.</p>
      </div>
    );

  return (
    <div className="space-y-4">
      <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm relative overflow-hidden group">

        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 shrink-0 overflow-hidden transition-transform group-hover:scale-105 duration-300">
            {business.businessProfileImage ? (
              <img
                src={business.businessProfileImage}
                className="w-full h-full object-cover"
                alt="Profile"
              />
            ) : (
              <Store size={22} className="text-gray-400" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <h2 className="text-sm font-medium text-black">
                {business.businessName}
              </h2>
              <Badge className="bg-black/5 text-black border-none px-2 py-0 text-[9px] font-medium uppercase">
                Active
              </Badge>
            </div>
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <MapPin size={12} className="text-gray-300" />{" "}
              {business.businessAddress}
            </p>
          </div>

          <button className="md:ml-auto px-4 py-2 bg-gray-50 text-black border border-gray-200 rounded-lg text-xs font-medium hover:bg-white hover:shadow-sm transition-all flex items-center gap-1.5">
            Update Profile <ChevronRight size={12} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-5 mt-5 border-t border-gray-100">
          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-gray-50">
            <Phone size={12} className="text-gray-400" />
            <span className="text-xs font-medium text-gray-600">
              {business.businessPhoneNumber}
            </span>
          </div>
          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-gray-50">
            <Clock size={12} className="text-gray-400" />
            <span className="text-xs font-medium text-gray-600">
              {business.openingTime} - {business.closingTime}
            </span>
          </div>
          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-gray-50">
            <Tag size={12} className="text-gray-400" />
            <span className="text-xs font-medium text-gray-600">
              {displayedServices.length} Services Offered
            </span>
          </div>
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-medium text-black">
              Current Offerings
            </h3>
            <p className="text-[10px] text-gray-400">
              Add or edit the services your customers can book
            </p>
          </div>
          <button
            onClick={() => setIsAddServiceModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-black text-white rounded-lg text-xs font-medium hover:bg-gray-800 transition-all active:scale-95"
          >
            <Plus size={14} /> Add New
          </button>
        </div>

        <div className="space-y-2">
          {displayedServices.length > 0 ? (
            displayedServices.map((service: ServiceItem) => (
              <div
                key={service.id}
                className="flex items-center justify-between p-4 bg-gray-50/50 border border-gray-100 rounded-lg hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center border border-gray-100 group-hover:bg-gray-100 transition-colors">
                    <Tag
                      size={14}
                      className="text-gray-400"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-black">
                      {service.service}
                    </h4>
                    <p className="text-[10px] text-gray-400">
                      {service.durationMinutes} mins •{" "}
                      <span className="text-black font-medium">
                        ${service.price}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    className="p-1.5 text-gray-400 hover:text-black transition-all rounded-lg hover:bg-gray-100"
                    title="Edit service"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-all rounded-lg hover:bg-red-50"
                    title="Delete service"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center border-2 border-dashed border-gray-100 rounded-xl">
              <Tag size={20} className="text-gray-200 mx-auto mb-2" />
              <p className="text-xs font-medium text-gray-400">
                No services added yet
              </p>
            </div>
          )}
        </div>
      </section>

      {isAddServiceModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px] p-4 flex items-center justify-center"
          onClick={() => setIsAddServiceModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-black">Add Service</h4>
              <p className="text-xs text-gray-400 mt-1">
                Enter service name, price, and duration in minutes.
              </p>
            </div>

            <form onSubmit={handleAddService} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Service Name
                </label>
                <input
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="e.g. Haircut"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Price
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={servicePrice}
                  onChange={(e) => setServicePrice(e.target.value)}
                  placeholder="e.g. 25"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={serviceDurationMinutes}
                  onChange={(e) => setServiceDurationMinutes(e.target.value)}
                  placeholder="e.g. 30"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
                  required
                />
              </div>

              <div className="pt-1 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddServiceModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-black text-white text-xs font-medium hover:bg-gray-800"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
