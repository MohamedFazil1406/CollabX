"use client";

import { useEffect } from "react";
import { socket } from "@/socket/client";
import { RoomServiceMsg } from "@collabx/types";
import { useUserStore } from "@/store/users";

export default function UserList() {
  const { users, setUsers } = useUserStore();

  useEffect(() => {
    const handleUsers = (users: Record<string, string>) => {
      setUsers(users);
    };

    socket.on(RoomServiceMsg.SYNC_USERS, handleUsers);

    // Request the current user list
    socket.emit(RoomServiceMsg.SYNC_USERS);

    return () => {
      socket.off(RoomServiceMsg.SYNC_USERS, handleUsers);
    };
  }, [setUsers]);

  return (
    <div className="w-64 border-r bg-zinc-900 text-white p-4">
      <h2 className="mb-4 text-lg font-semibold">
        Connected Users ({Object.keys(users).length})
      </h2>

      <ul className="space-y-2">
        {Object.entries(users).map(([id, username]) => (
          <li key={id} className="rounded bg-zinc-800 px-3 py-2">
            <span className="font-bold">{id}</span>
            {" - "}
            {username}
          </li>
        ))}
      </ul>
    </div>
  );
}
