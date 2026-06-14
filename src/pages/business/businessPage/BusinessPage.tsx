import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
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
  X,
} from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Skeleton } from "../../../components/ui/skeleton";
import ImageUploader from "../../../components/ImageUploader";

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface ServiceItem {
  id: string | number;
  service: string;
  price: number;
  durationMinutes: number;
}

interface EditableBusinessProfile {
  businessName: string;
  businessAddress: string;
}

interface UpdateProfilePayload {
  businessName: string;
  businessAddress: string;
  businessProfileImage?: string;
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

const addService = async (
  token: string | null,
  serviceName: string,
  servicePrice: number,
  serviceDuration: number,
) => {
  const response = await fetch(`${API_BASE_URL}/api/services/add-service`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ serviceName, servicePrice, serviceDuration }),
  });
  if (!response.ok) throw new Error("Failed to add service");
  return response.json();
};

const updateBusinessProfile = async (
  token: string | null,
  payload: UpdateProfilePayload,
) => {
  const response = await fetch(`${API_BASE_URL}/api/business/update-business`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Failed to update business profile");
  return response.json();
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
  const queryClient = useQueryClient();

  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  const [serviceName, setServiceName] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [serviceDurationMinutes, setServiceDurationMinutes] = useState("");

  const [draftProfile, setDraftProfile] = useState<EditableBusinessProfile>({
    businessName: "",
    businessAddress: "",
  });

  const [uploadedProfileImageUrl, setUploadedProfileImageUrl] = useState<string | null>(null);
  const [coverImageUrls, setCoverImageUrls] = useState<string[]>([]);

  const { data: business, isLoading } = useQuery({
    queryKey: ["owner-business", token],
    queryFn: () => fetchBusinessByOwner(token),
    enabled: !!token,
  });

  const addServiceMutation = useMutation({
    mutationFn: ({
      serviceName,
      servicePrice,
      serviceDuration,
    }: {
      serviceName: string;
      servicePrice: number;
      serviceDuration: number;
    }) => addService(token, serviceName, servicePrice, serviceDuration),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-business"] });
      setServiceName("");
      setServicePrice("");
      setServiceDurationMinutes("");
      setIsAddServiceModalOpen(false);
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      updateBusinessProfile(token, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-business"] });
      closeProfileModal();
    },
    onError: (error) => {
      console.error("Failed to update profile:", error);
    },
  });

  const displayedServices: ServiceItem[] = [
    ...((business?.services || []) as ServiceItem[]),
  ];

  const handleOpenProfileModal = () => {
    setDraftProfile({
      businessName: business.businessName,
      businessAddress: business.businessAddress,
    });
    setUploadedProfileImageUrl(null);
    setIsEditProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setUploadedProfileImageUrl(null);
    setIsEditProfileModalOpen(false);
  };

  const handleSaveProfile = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!draftProfile.businessName.trim() || !draftProfile.businessAddress.trim()) return;

    const payload: UpdateProfilePayload = {
      businessName: draftProfile.businessName,
      businessAddress: draftProfile.businessAddress,
      ...(uploadedProfileImageUrl && { businessProfileImage: uploadedProfileImageUrl }),
      ...(coverImageUrls.length > 0 && { businessCoverImages: coverImageUrls }),
    };

    updateProfileMutation.mutate(payload);
  };

  const handleAddService = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!serviceName.trim() || !servicePrice.trim() || !serviceDurationMinutes.trim()) return;

    const parsedPrice = Number(servicePrice);
    const parsedDuration = Number(serviceDurationMinutes);

    if (Number.isNaN(parsedPrice) || Number.isNaN(parsedDuration)) return;

    addServiceMutation.mutate({
      serviceName,
      servicePrice: parsedPrice,
      serviceDuration: parsedDuration,
    });
  };

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
      {/* Business Profile Card */}
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
              <MapPin size={12} className="text-gray-300" />
              {business.businessAddress}
            </p>
          </div>

          <button
            onClick={handleOpenProfileModal}
            className="md:ml-auto px-4 py-2 bg-gray-50 text-black border border-gray-200 rounded-lg text-xs font-medium hover:bg-white hover:shadow-sm transition-all flex items-center gap-1.5"
          >
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

      {/* Edit Profile Modal */}
      {isEditProfileModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px] p-4 flex items-center justify-center"
          onClick={closeProfileModal}
        >
          <div
            className="w-full max-w-2xl rounded-[24px] border border-gray-200 bg-white shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/70">
              <div>
                <h3 className="text-base font-semibold text-black">Update Profile</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Change your business name, location, and profile image.
                </p>
              </div>
              <button
                type="button"
                onClick={closeProfileModal}
                className="w-9 h-9 rounded-full border border-gray-200 bg-white text-gray-500 hover:text-black hover:bg-gray-50 flex items-center justify-center transition-colors"
                aria-label="Close profile editor"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveProfile} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={draftProfile.businessName}
                    onChange={(e) =>
                      setDraftProfile((prev) => ({
                        ...prev,
                        businessName: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
                    placeholder="Enter business name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Location / Address
                  </label>
                  <input
                    type="text"
                    value={draftProfile.businessAddress}
                    onChange={(e) =>
                      setDraftProfile((prev) => ({
                        ...prev,
                        businessAddress: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
                    placeholder="Enter business location"
                    required
                  />
                </div>
              </div>

              {/* Image Uploader */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Profile Image
                </label>
                <ImageUploader
                  onUploadSuccess={(img) => setUploadedProfileImageUrl(img.url)}
                />
              </div>
          
              {/* Cover Image Uploader */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Cover Images
                </label>

                <ImageUploader
                  multiple
                  folder="/covers"
                  onUploadSuccess={(img) => setCoverImageUrls((prev) => [...prev, img.url])}
                />
              </div>

              {/* Error message */}
              {updateProfileMutation.isError && (
                <p className="text-xs text-red-500">
                  Something went wrong. Please try again.
                </p>
              )}

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeProfileModal}
                  disabled={updateProfileMutation.isPending}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="px-5 py-2.5 rounded-xl bg-black text-white text-xs font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Services Section */}
      <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-medium text-black">Current Offerings</h3>
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
                    <Tag size={14} className="text-gray-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-black">
                      {service.service}
                    </h4>
                    <p className="text-[10px] text-gray-400">
                      {service.durationMinutes} mins •{" "}
                      <span className="text-black font-medium">${service.price}</span>
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
              <p className="text-xs font-medium text-gray-400">No services added yet</p>
            </div>
          )}
        </div>
      </section>

      {/* Add Service Modal */}
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
                  disabled={addServiceMutation.isPending}
                  className="px-4 py-2 rounded-lg bg-black text-white text-xs font-medium hover:bg-gray-800 disabled:opacity-50"
                >
                  {addServiceMutation.isPending ? "Saving..." : "Save Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}