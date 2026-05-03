import { useQuery } from "@tanstack/react-query";
import { fetchBookings } from "../pages/business/booking/api/bookingApi";

export function useBooking(token: string | null | undefined) {
    return useQuery({
       queryKey: ["bookings", token],
    queryFn: () => {
      if (!token) throw new Error("No auth token found");
      return fetchBookings(token);
    },
    enabled: !!token, 
    })
}