"use client";

import { useEffect, useState } from "react";

import { useExplorerStore } from "@/store/explorer";

interface RenameFileDialogProps {
  open: boolean;
  fileId: string | null;
  initialName: string;
  onClose: () => void;
}

export default function RenameFileDialog({
  open,
  fileId,
  initialName,
  onClose,
}: RenameFileDialogProps) {
  const { renameFile } = useExplorerStore();

  const [name, setName] = useState(initialName);

  useEffect(() => {
    if (open) {
      setName(initialName);
    }
  }, [open, initialName]);

  if (!open) return null;

  const handleRename = () => {
    if (!fileId) return;

    const trimmed = name.trim();

    if (!trimmed) return;

    renameFile(fileId, trimmed);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-96 rounded-lg border border-zinc-800 bg-zinc-900 p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold text-white">Rename File</h2>

        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleRename();
            }

            if (e.key === "Escape") {
              onClose();
            }
          }}
          className="w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-blue-500"
        />

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded bg-zinc-700 px-4 py-2 hover:bg-zinc-600"
          >
            Cancel
          </button>

          <button
            onClick={handleRename}
            className="rounded bg-blue-600 px-4 py-2 hover:bg-blue-500"
          >
            Rename
          </button>
        </div>
      </div>
    </div>
  );
}
