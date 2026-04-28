import { io, Socket } from "socket.io-client";

const API_BASE_URL = import.meta.env.VITE_API_URL;

let socket: Socket | null = null;

export const initializeSocket = (token: string, businessId: number): Socket => {
  if (socket?.connected) {
    return socket;
  }

  socket = io(API_BASE_URL, {
    auth: { token },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  socket.on("connect", () => {
    console.log("Socket connected");
    socket!.emit("join:business", businessId);
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
