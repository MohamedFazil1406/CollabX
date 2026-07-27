"use client";

import { useParams } from "next/navigation";
import CodeEditor from "@/components/editor/CodeEditor";

export default function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>();

  return (
    <main className="h-screen">
      <CodeEditor roomId={roomId} />
    </main>
  );
}
