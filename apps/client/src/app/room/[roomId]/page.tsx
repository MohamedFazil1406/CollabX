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
    <main className="flex h-screen">
      <UserList />

      <FileExplorer />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex min-h-0 flex-1">
          <div className="min-w-0 flex-1">
            <EditorWorkspace roomId={roomId} />
          </div>

          <RightSidebar />
        </div>

        <TerminalPanel />
      </div>
    </main>
  );
}
