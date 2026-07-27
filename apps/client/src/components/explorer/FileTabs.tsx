"use client";

import { X } from "lucide-react";

import { useExplorerStore } from "@/store/explorer";

export default function FileTabs() {
  const { files, openTabs, activeFileId, setActiveFile, closeTab } =
    useExplorerStore();

  const openFiles = files.filter((file) => openTabs.includes(file.id));

  if (openFiles.length === 0) {
    return (
      <div className="flex h-10 items-center border-b border-zinc-800 bg-zinc-950 px-4 text-sm text-zinc-500">
        No file opened
      </div>
    );
  }

  return (
    <div className="flex h-10 overflow-x-auto border-b border-zinc-800 bg-zinc-950">
      {openFiles.map((file) => (
        <div
          key={file.id}
          className={`group flex cursor-pointer items-center gap-2 border-r border-zinc-800 px-4 text-sm transition-colors ${
            activeFileId === file.id
              ? "bg-zinc-900 text-white"
              : "text-zinc-400 hover:bg-zinc-800"
          }`}
          onClick={() => setActiveFile(file.id)}
        >
          <span className="truncate">{file.name}</span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              closeTab(file.id);
            }}
            className="rounded p-0.5 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-zinc-700"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
