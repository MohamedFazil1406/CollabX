"use client";

import MarkdownEditor from "./MarkdownEditor";

export default function NotesPanel() {
  return (
    <div className="flex h-full flex-col border-l border-zinc-800 bg-zinc-950">
      <div className="flex h-12 items-center border-b border-zinc-800 px-4">
        <h2 className="text-sm font-semibold text-zinc-200">Shared Notes</h2>
      </div>

      <div className="min-h-0 flex-1 p-4">
        <MarkdownEditor />
      </div>
    </div>
  );
}
