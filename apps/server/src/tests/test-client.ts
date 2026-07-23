import { io } from "socket.io-client";
import { RoomServiceMsg } from "@collabx/types";

const client1 = io("http://localhost:3000");
const client2 = io("http://localhost:3000");

let roomId = "";

client1.on("connect", () => {
  console.log("✅ Client 1 Connected");

  client1.emit(RoomServiceMsg.CREATE, "Mohamed");
});

client1.on(RoomServiceMsg.CREATE, (id: string, name: string) => {
  console.log("Room ID:", id);
  console.log("Created By:", name);

  roomId = id;

  // Client 2 joins the room after it is created
  client2.emit(RoomServiceMsg.JOIN, roomId, "Alice");
});

client2.on("connect", () => {
  console.log("✅ Client 2 Connected");
});

client2.on(RoomServiceMsg.JOIN, (id: string) => {
  console.log("Client 2 joined room:", id);
});

client2.on(RoomServiceMsg.SYNC_USERS, (users) => {
  console.log("Users in room:", users);
});

client2.on(RoomServiceMsg.NOT_FOUND, (id: string) => {
  console.log("Room not found:", id);
});
