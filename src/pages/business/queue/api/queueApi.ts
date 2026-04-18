const API_BASE_URL = import.meta.env.VITE_API_URL;

export interface QueueEntry {
  id: number;
  position: number;
  status: "WAITING" | "IN_PROGRESS" | "DONE";
  joinedAt: string;
  booking: {
    scheduledAt: string;
    customer: { displayName: string | null; phoneNumber: string | null };
    service: { service: string | null; durationMinutes: number; price: number };
  };
}

export interface ServiceItem {
  id: string | number;
  service: string;
  price: number;
  durationMinutes: number;
}

export interface TimeSlot {
  start: string;
  end: string;
  label: string;
}

export interface WalkInData {
  customerName: string;
  phoneNumber: string;
  serviceId: string;
  slot: TimeSlot;
}

export const fetchQueue = async (token: string): Promise<QueueEntry[]> => {
  const res = await fetch(`${API_BASE_URL}/api/liveQueue/get-live-queue`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("Failed to fetch queue");

  return res.json();
};

export const fetchBusinessByOwner = async (token: string) => {
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

export const generateAvailableSlots = async (
  token: string,
  serviceId: string,
): Promise<TimeSlot[]> => {
  const response = await fetch(
    `${API_BASE_URL}/api/liveQueue/get-available-slots/${serviceId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) throw new Error("Failed to generate available slots");

  const data = await response.json();
  return Array.isArray(data)
    ? data
    : Array.isArray(data?.slots)
      ? data.slots
      : [];
};

export const addWalkIn = async (token: string, walkInData: WalkInData) => {
  const res = await fetch(`${API_BASE_URL}/api/liveQueue/add-walkins`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      customerName: walkInData.customerName,
      customerPhone: walkInData.phoneNumber,
      serviceId: walkInData.serviceId,
      scheduledAt: walkInData.slot.start,
    }),
  });

  if (!res.ok) throw new Error("Failed to add walk-in");

  return res.json();
};