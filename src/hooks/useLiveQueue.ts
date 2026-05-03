import { useQuery } from "@tanstack/react-query";
import { fetchQueue } from "../pages/business/queue/api/queueApi";
import type { QueueEntry } from "../pages/business/queue/api/queueApi";

export function useLiveQueue(token: string | null | undefined) {
  return useQuery<QueueEntry[]>({
    queryKey: ["queue", token],
    queryFn: () => {
      if (!token) throw new Error("No token");
      return fetchQueue(token);
    },
    enabled: !!token,
  });
}