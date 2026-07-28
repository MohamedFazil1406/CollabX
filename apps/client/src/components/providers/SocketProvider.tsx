"use client";

import { useEffect } from "react";

import { useFiles } from "@/hooks/useFiles";
import { socket } from "@/socket/client";

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useFiles();

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  return <>{children}</>;
}
