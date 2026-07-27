"use client";

import { useState } from "react";

import { FileServiceMsg } from "@collabx/types";

import { socket } from "@/socket/client";
import { useRoomStore } from "@/store/room";
import { getLanguageFromFilename } from "@/utils/fileLanguage";

interface NewFileDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function NewFileDialog({ open, onClose }: NewFileDialogProps) {
  const roomId = useRoomStore((state) => state.roomId);

  const [name, setName] = useState("");

  if (!open) return null;

  const handleCreate = () => {
    const trimmed = name.trim();

    if (!trimmed || !roomId) return;

    socket.emit(FileServiceMsg.CREATE, {
      roomId,
      file: {
        id: crypto.randomUUID(),
        name: trimmed,
        language: getLanguageFromFilename(trimmed),
        content: "",
      },
    });

    setName("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-96 rounded-lg border border-zinc-700 bg-zinc-900 shadow-xl">
        <div className="border-b border-zinc-700 px-5 py-4">
          <h2 className="text-lg font-semibold text-white">New File</h2>
        </div>

        <div className="space-y-4 p-5">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="example.ts"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
              if (e.key === "Escape") onClose();
            }}
            className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex justify-end gap-3 border-t border-zinc-700 px-5 py-4">
          <button
            onClick={onClose}
            className="rounded-md bg-zinc-700 px-4 py-2 text-sm text-white hover:bg-zinc-600"
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-500"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
