"use client";

import { useEffect } from "react";

import { socket } from "@/socket/client";
import { useCursorStore } from "@/store/cursors";

import { CodeServiceMsg, RoomServiceMsg, type Cursor } from "@collabx/types";

interface CursorPayload {
  userID: string;
  cursor: Cursor;
}

export function useRemoteCursor() {
  const { updateCursor, removeCursor } = useCursorStore();

  useEffect(() => {
    const handleCursor = ({ userID, cursor }: CursorPayload) => {
      updateCursor(userID, cursor);
    };

    const handleLeave = (userID: string) => {
      removeCursor(userID);
    };

    socket.on(CodeServiceMsg.UPDATE_CURSOR, handleCursor);

    socket.on(RoomServiceMsg.LEAVE, handleLeave);

    return () => {
      socket.off(CodeServiceMsg.UPDATE_CURSOR, handleCursor);

      socket.off(RoomServiceMsg.LEAVE, handleLeave);
    };
  }, [updateCursor, removeCursor]);
}
