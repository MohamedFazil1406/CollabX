import { io } from "socket.io-client";
import { RoomServiceMsg } from "@collabx/types";

const client1 = io("http://localhost:3000");
const client2 = io("http://localhost:3000");

let roomId = "";

/* ---------------- Client 1 ---------------- */

client1.on("connect", () => {
  console.log("✅ Client 1 Connected");

  client1.emit(RoomServiceMsg.CREATE, "Fazil");
});

client1.on(RoomServiceMsg.CREATE, (id: string, name: string) => {
  roomId = id;

  console.log("Room ID:", roomId);
  console.log("Created By:", name);

  // Client 2 joins the room
  client2.emit(RoomServiceMsg.JOIN, roomId, "Deepak");
});

client1.on(RoomServiceMsg.LEAVE, (id: string) => {
  console.log("❌ User Left:", id);
});

client1.on(RoomServiceMsg.SYNC_USERS, (users) => {
  console.log("👥 Updated Users:", users);
});

/* ---------------- Client 2 ---------------- */

client2.on("connect", () => {
  console.log("✅ Client 2 Connected");
});

client2.on(RoomServiceMsg.JOIN, (id: string) => {
  console.log("✅ Client 2 Joined Room:", id);

  // Test LEAVE after 3 seconds
  setTimeout(() => {
    console.log("➡️ Client 2 Leaving...");
    client2.emit(RoomServiceMsg.LEAVE);
  }, 3000);

  // Test TERMINATE after 6 seconds
  setTimeout(() => {
    console.log("💥 Client 1 Terminating Room...");
    client1.emit(RoomServiceMsg.TERMINATE);
  }, 6000);

  // Test joining after termination
  setTimeout(() => {
    console.log("🔄 Trying to Join Again...");
    client2.emit(RoomServiceMsg.JOIN, roomId, "Deepak");
  }, 9000);
});

client2.on(RoomServiceMsg.SYNC_USERS, (users) => {
  console.log("👥 Users in Room:", users);
});

client2.on(RoomServiceMsg.TERMINATE, () => {
  console.log("💥 Room Terminated");
});

client2.on(RoomServiceMsg.NOT_FOUND, (id: string) => {
  console.log("❌ Room Not Found:", id);
});
