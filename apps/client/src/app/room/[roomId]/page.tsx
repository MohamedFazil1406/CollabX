"use client";

import { useParams } from "next/navigation";

import CodeEditor from "@/components/editor/CodeEditor";
import UserList from "@/components/users/UserList";
import VideoGrid from "@/components/video/VideoGrid";

export default function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>();

  return (
    <main className="flex h-screen w-full">
      <UserList />

      <div className="flex flex-1 min-w-0">
        <div className="flex-1 min-w-0">
          <CodeEditor roomId={roomId} />
        </div>

        <aside className="w-72 shrink-0 border-l border-zinc-800 bg-zinc-950 p-4">
          <VideoGrid />
        </aside>
      </div>
    </main>
  );
}
