"use client";

import { useEffect } from "react";

import { socket } from "@/socket/client";
import { useNotesStore } from "@/store/notes";

import { RoomServiceMsg } from "@collabx/types";

export function useNotes() {
  const { setNote } = useNotesStore();

  useEffect(() => {
    socket.emit(RoomServiceMsg.SYNC_MD);

    const handleNote = (note: string) => {
      setNote(note);
    };

    socket.on(RoomServiceMsg.UPDATE_MD, handleNote);

    return () => {
      socket.off(RoomServiceMsg.UPDATE_MD, handleNote);
    };
  }, [setNote]);
}
