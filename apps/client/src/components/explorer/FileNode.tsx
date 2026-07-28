"use client";

import { FileText, Trash2 } from "lucide-react";

import { FileServiceMsg } from "@collabx/types";

import { socket } from "@/socket/client";
import { useExplorerStore, type ExplorerFile } from "@/store/explorer";
import { useRoomStore } from "@/store/room";

interface FileNodeProps {
  file: ExplorerFile;
}

export default function FileNode({ file }: FileNodeProps) {
  const { activeFileId, openFile } = useExplorerStore();
  const roomId = useRoomStore((state) => state.roomId);

  const isActive = activeFileId === file.id;

  return (
    <div
      className={`group flex items-center justify-between px-3 py-2 text-sm transition-colors ${
        isActive ? "bg-zinc-800 text-white" : "text-zinc-300 hover:bg-zinc-900"
      }`}
    >
      <button
        onClick={() => openFile(file.id)}
        className="flex flex-1 items-center gap-2 text-left"
      >
        <FileText size={16} />
        <span className="truncate">{file.name}</span>
      </button>

      <button
        onClick={() => {
          if (!roomId) return;

          socket.emit(FileServiceMsg.DELETE, {
            roomId,
            fileId: file.id,
          });
        }}
        className="rounded p-1 opacity-0 transition-opacity hover:bg-zinc-700 group-hover:opacity-100"
        title="Delete file"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
