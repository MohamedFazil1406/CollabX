"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";

import { useExplorerStore } from "@/store/explorer";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const { files, openFile } = useExplorerStore();

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setSelected(0);
    }
  }, [open]);

  const filteredFiles = useMemo(() => {
    return files.filter((file) =>
      file.name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [files, query]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();

        setSelected((prev) => Math.min(prev + 1, filteredFiles.length - 1));
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();

        setSelected((prev) => Math.max(prev - 1, 0));
      }

      if (e.key === "Enter") {
        const file = filteredFiles[selected];

        if (!file) return;

        openFile(file.id);
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [filteredFiles, selected, open, openFile, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 pt-24">
      <div className="w-full max-w-xl overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 shadow-2xl">
        <div className="flex items-center border-b border-zinc-700 px-4">
          <Search className="mr-3 h-4 w-4 text-zinc-400" />

          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected(0);
            }}
            placeholder="Search files..."
            className="h-12 w-full bg-transparent text-white outline-none placeholder:text-zinc-500"
          />
        </div>

        <div className="max-h-80 overflow-y-auto">
          {filteredFiles.length === 0 ? (
            <div className="p-4 text-sm text-zinc-500">No matching files</div>
          ) : (
            filteredFiles.map((file, index) => (
              <button
                key={file.id}
                onClick={() => {
                  openFile(file.id);
                  onClose();
                }}
                className={`flex w-full items-center px-4 py-3 text-left text-sm ${
                  selected === index
                    ? "bg-blue-600 text-white"
                    : "text-zinc-300 hover:bg-zinc-800"
                }`}
              >
                {file.name}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
