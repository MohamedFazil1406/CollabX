"use client";

import { useEffect } from "react";

import { socket } from "@/socket/client";
import { usePointerStore } from "@/store/pointers";

import { PointerServiceMsg, RoomServiceMsg } from "@collabx/types";

interface Pointer {
  x: number;
  y: number;
}

export function useRemotePointer() {
  const { updatePointer, removePointer, clearPointers } = usePointerStore();

  useEffect(() => {
    const handlePointer = (userID: string, pointer: Pointer) => {
      updatePointer(userID, [pointer.x, pointer.y]);
    };

    const handleLeave = (userID: string) => {
      removePointer(userID);
    };

    const handleTerminate = () => {
      clearPointers();
    };

    socket.on(PointerServiceMsg.POINTER, handlePointer);
    socket.on(RoomServiceMsg.LEAVE, handleLeave);
    socket.on(RoomServiceMsg.TERMINATE, handleTerminate);

    return () => {
      socket.off(PointerServiceMsg.POINTER, handlePointer);
      socket.off(RoomServiceMsg.LEAVE, handleLeave);
      socket.off(RoomServiceMsg.TERMINATE, handleTerminate);
    };
  }, [updatePointer, removePointer, clearPointers]);
}
