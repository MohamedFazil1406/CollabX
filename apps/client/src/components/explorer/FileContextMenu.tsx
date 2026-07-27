"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, FilePlus2, FolderPlus, Pencil, Trash2 } from "lucide-react";

import { FileServiceMsg } from "@collabx/types";

import RenameFileDialog from "@/components/explorer/RenameFileDialog";
import { socket } from "@/socket/client";
import { ExplorerFile } from "@/store/explorer";
import { useRoomStore } from "@/store/room";

interface FileContextMenuProps {
  file: ExplorerFile;
  x: number;
  y: number;
  open: boolean;
  onClose: () => void;
}

export default function FileContextMenu({
  file,
  x,
  y,
  open,
  onClose,
}: FileContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  const roomId = useRoomStore((state) => state.roomId);

  const [renameOpen, setRenameOpen] = useState(false);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        onClose();
      }
    };

    if (open) {
      window.addEventListener("mousedown", handleClick);
    }

    return () => {
      window.removeEventListener("mousedown", handleClick);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div
        ref={ref}
        style={{
          top: y,
          left: x,
        }}
        className="fixed z-50 w-52 rounded-md border border-zinc-700 bg-zinc-900 py-1 shadow-xl"
      >
        <button
          className="flex w-full items-center gap-3 px-4 py-2 text-sm hover:bg-zinc-800"
          onClick={() => {
            if (!roomId) return;

            socket.emit(FileServiceMsg.CREATE, {
              roomId,
              file: {
                id: crypto.randomUUID(),
                name: "untitled.ts",
                language: "typescript",
                content: "",
              },
            });

            onClose();
          }}
        >
          <FilePlus2 size={16} />
          New File
        </button>

        <button
          className="flex w-full items-center gap-3 px-4 py-2 text-sm hover:bg-zinc-800"
          onClick={() => {
            alert("Folder support coming soon.");
            onClose();
          }}
        >
          <FolderPlus size={16} />
          New Folder
        </button>

        <button
          className="flex w-full items-center gap-3 px-4 py-2 text-sm hover:bg-zinc-800"
          onClick={() => {
            setRenameOpen(true);
            onClose();
          }}
        >
          <Pencil size={16} />
          Rename
        </button>

        <button
          className="flex w-full items-center gap-3 px-4 py-2 text-sm hover:bg-zinc-800"
          onClick={() => {
            navigator.clipboard.writeText(file.name);
            onClose();
          }}
        >
          <Copy size={16} />
          Copy Name
        </button>

        <button
          className="flex w-full items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500/10"
          onClick={() => {
            if (!roomId) return;

            socket.emit(FileServiceMsg.DELETE, {
              roomId,
              fileId: file.id,
            });

            onClose();
          }}
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>

      <RenameFileDialog
        open={renameOpen}
        fileId={file.id}
        initialName={file.name}
        onClose={() => setRenameOpen(false)}
      />
    </>
  );
}
