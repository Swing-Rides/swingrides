"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
    
    console.log(`🔌 Initializing WebSocket client connection to: ${socketUrl}`);
    
    const socketInstance = io(socketUrl, {
      withCredentials: true,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on("connect", () => {
      console.log(`🔌 WebSocket connected: ${socketInstance.id}`);
      setIsConnected(true);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log(`🔌 WebSocket disconnected: ${reason}`);
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (error) => {
      console.error("🔌 WebSocket connection error:", error.message);
    });

    setSocket(socketInstance);

    return () => {
      console.log("🔌 Cleaning up WebSocket connection...");
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
