"use client";

import { useParams } from "next/navigation";
import CodeEditor from "@/components/editor/CodeEditor";
import UserList from "@/components/users/UserList";

export default function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>();

  return (
    <main className="flex h-screen">
      <UserList />

      <div className="flex-1">
        <CodeEditor roomId={roomId} />
      </div>
    </main>
  );
}
