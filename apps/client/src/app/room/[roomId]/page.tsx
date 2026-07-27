"use client";

import { useParams } from "next/navigation";
import CodeEditor from "@/components/editor/CodeEditor";
import UserList from "@/components/users/UserList";
import VideoGrid from "@/components/video/VideoGrid";

export default function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>();

  return (
    <main className="flex h-screen">
      <div className="flex h-screen">
        <UserList />

        <div className="flex flex-1">
          <div className="flex-1">
            <CodeEditor roomId={roomId} />
          </div>

          <div className="w-80 border-l border-zinc-800 bg-zinc-950 p-4">
            <VideoGrid />
          </div>
        </div>
      </div>
    </main>
  );
}
