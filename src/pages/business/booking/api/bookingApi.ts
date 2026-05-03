const API_BASE_URL = import.meta.env.VITE_API_URL;


export const fetchBookings = async (token: string) => {
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
