"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RoomServiceMsg } from "@collabx/types";
import { socket } from "@/socket/client";

export default function HomePage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    const handleCreate = (createdRoomId: string, customId: string) => {
      console.log("Created:", createdRoomId, customId);

      router.push(`/room/${createdRoomId}`);
    };

    const handleJoin = (customId: string) => {
      console.log("Joined:", roomId, customId);

      router.push(`/room/${roomId}`);
    };

    const handleNotFound = (id: string) => {
      alert(`Room ${id} not found`);
    };

    socket.on(RoomServiceMsg.CREATE, handleCreate);
    socket.on(RoomServiceMsg.JOIN, handleJoin);
    socket.on(RoomServiceMsg.NOT_FOUND, handleNotFound);

    return () => {
      socket.off(RoomServiceMsg.CREATE, handleCreate);
      socket.off(RoomServiceMsg.JOIN, handleJoin);
      socket.off(RoomServiceMsg.NOT_FOUND, handleNotFound);
    };
  }, [router, roomId]);

  const createRoom = () => {
    if (!username.trim()) {
      alert("Enter username");
      return;
    }

    socket.emit(RoomServiceMsg.CREATE, username.trim());
  };

  const joinRoom = () => {
    if (!username.trim()) {
      alert("Enter username");
      return;
    }

    if (!roomId.trim()) {
      alert("Enter room ID");
      return;
    }

    socket.emit(RoomServiceMsg.JOIN, roomId.trim(), username.trim());
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-black">
      <div className="w-100 rounded-xl bg-zinc-900 p-8 shadow-xl">
        <h1 className="mb-8 text-center text-4xl font-bold text-white">
          CollabX
        </h1>

        <input
          className="mb-4 w-full rounded border p-3 text-white"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="mb-6 w-full rounded border p-3 text-white"
          placeholder="Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value.toUpperCase())}
        />

        <button
          onClick={createRoom}
          className="mb-3 w-full rounded bg-blue-600 p-3 text-white"
        >
          Create Room
        </button>

        <button
          onClick={joinRoom}
          className="w-full rounded bg-green-600 p-3 text-white"
        >
          Join Room
        </button>
      </div>
    </main>
  );
}
