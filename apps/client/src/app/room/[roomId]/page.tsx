"use client";

import { useParams } from "next/navigation";

import CodeEditor from "@/components/editor/CodeEditor";
import UserList from "@/components/users/UserList";
import TerminalPanel from "@/components/terminal/TerminalPanel";
import RightSidebar from "@/components/layout/RightSidebar";

export default function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>();

  return (
    <main className="flex h-screen w-full">
      <UserList />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex min-h-0 flex-1">
          <div className="min-w-0 flex-1">
            <CodeEditor roomId={roomId} />
          </div>

          <RightSidebar />
        </div>

        <TerminalPanel />
      </div>
    </main>
  );
}
