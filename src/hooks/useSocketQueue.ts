import { useEffect } from "react";
import { initializeSocket, disconnectSocket } from "../services/socketService";

interface UseSocketQueueOptions {
  token: string;
  businessId: number | null;
  onUserAdded?: (userData: unknown) => void;
}

export const useSocketQueue = ({
  token,
  businessId,
  onUserAdded,
}: UseSocketQueueOptions) => {
  useEffect(() => {
    if (!token || !businessId) return;

    const socket = initializeSocket(token, businessId);

    // Listen for new user added to queue
    if (onUserAdded) {
      socket.on("queue:user-added", onUserAdded);
    }

    // Cleanup: disconnect when leaving page
    return () => {
      if (onUserAdded) {
        socket.off("queue:user-added", onUserAdded);
      }
      disconnectSocket();
    };
  }, [token, businessId, onUserAdded]);
};
