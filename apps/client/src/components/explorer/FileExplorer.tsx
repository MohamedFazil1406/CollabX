"use client";

import { useState } from "react";

import NewFileDialog from "@/components/explorer/NewFileDialog";
import FileTree from "@/components/explorer/FileTree";
import GithubExplorer from "@/components/github/GithubExplorer";

export default function FileExplorer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <aside className="flex h-full w-64 flex-col border-r border-zinc-800 bg-zinc-950">
        <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
          <h2 className="text-sm font-semibold text-zinc-200">Explorer</h2>

          <button
            onClick={() => setOpen(true)}
            className="rounded bg-zinc-800 px-2 py-1 text-xs hover:bg-zinc-700"
          >
            +
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Local Project Files */}
          <FileTree />

          {/* GitHub Repositories */}
          <GithubExplorer />
        </div>
      </aside>

      <NewFileDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
