"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

import UserList from "@/components/users/UserList";
import TerminalPanel from "@/components/terminal/TerminalPanel";
import RightSidebar from "@/components/layout/RightSidebar";
import FileExplorer from "@/components/explorer/FileExplorer";
import EditorWorkspace from "@/components/editor/EditorWorkspace";
import { useRoomStore } from "@/store/room";

export default function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>();

  const setRoomId = useRoomStore((state) => state.setRoomId);

  useEffect(() => {
    setRoomId(roomId);
  }, [roomId, setRoomId]);

  return (
    <main className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Connected Users */}
      <aside className="w-56 border-r border-zinc-800 bg-zinc-900">
        <UserList />
      </aside>

      {/* Explorer */}
      <aside className="w-72 border-r border-zinc-800 bg-zinc-900">
        <FileExplorer />
      </aside>

      {/* Main Content */}
      <section className="flex min-w-0 flex-1 flex-col">
        {/* Room Header */}
        <header className="flex h-12 items-center justify-between border-b border-zinc-800 px-4">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <span className="font-medium">Room {roomId}</span>
          </div>

          <div className="text-sm text-zinc-400">Collaborative IDE</div>
        </header>

        {/* Editor + Sidebar */}
        <div className="flex min-h-0 flex-1">
          <div className="min-w-0 flex-1">
            <EditorWorkspace roomId={roomId} />
          </div>

          <aside className="w-80 border-l border-zinc-800 bg-zinc-900">
            <RightSidebar />
          </aside>
        </div>

        {/* Terminal */}
        <div className="h-60 border-t border-zinc-800">
          <TerminalPanel />
        </div>
      </section>
    </main>
  );
}
