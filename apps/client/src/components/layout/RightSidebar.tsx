"use client";

import { useState } from "react";

import VideoGrid from "@/components/video/VideoGrid";
import NotesPanel from "@/components/notes/NotesPanel";

type Tab = "video" | "notes";

export default function RightSidebar() {
  const [activeTab, setActiveTab] = useState<Tab>("video");

  return (
    <aside className="flex w-80 shrink-0 flex-col border-l border-zinc-800 bg-zinc-950">
      <div className="flex border-b border-zinc-800">
        <button
          onClick={() => setActiveTab("video")}
          className={`flex-1 px-4 py-3 text-sm ${
            activeTab === "video"
              ? "bg-zinc-800 text-white"
              : "text-zinc-400 hover:bg-zinc-900"
          }`}
        >
          Video
        </button>

        <button
          onClick={() => setActiveTab("notes")}
          className={`flex-1 px-4 py-3 text-sm ${
            activeTab === "notes"
              ? "bg-zinc-800 text-white"
              : "text-zinc-400 hover:bg-zinc-900"
          }`}
        >
          Notes
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        {activeTab === "video" ? <VideoGrid /> : <NotesPanel />}
      </div>
    </aside>
  );
}
