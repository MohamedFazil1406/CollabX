import { io } from "socket.io-client";
import { RoomServiceMsg, CodeServiceMsg } from "@collabx/types";

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

  console.log("\n========== ROOM CREATED ==========");
  console.log("Room ID:", roomId);
  console.log("Created By:", name);

  client2.emit(RoomServiceMsg.JOIN, roomId, "Deepak");
});

client1.on(RoomServiceMsg.SYNC_USERS, (users) => {
  console.log("👥 Client 1 Users:", users);
});

client1.on(RoomServiceMsg.LEAVE, (id: string) => {
  console.log("❌ Client 1 Received Leave:", id);
});

client1.on(CodeServiceMsg.UPDATE_CODE, (code: string) => {
  console.log("📄 Client 1 Received Code:", code);
});

client1.on(CodeServiceMsg.SYNC_CODE, (code: string) => {
  console.log("📄 Client 1 Synced Code:", code);
});

client1.on(RoomServiceMsg.TERMINATE, () => {
  console.log("💥 Client 1 Room Terminated");
});

/* ---------------- Client 2 ---------------- */

client2.on("connect", () => {
  console.log("✅ Client 2 Connected");
});

client2.on(RoomServiceMsg.JOIN, (id: string) => {
  console.log("\n========== CLIENT 2 JOINED ==========");
  console.log("Joined Room:", id);

  // Update code
  setTimeout(() => {
    console.log("\n📄 Client 1 Updating Code");

    client1.emit(CodeServiceMsg.UPDATE_CODE, "<h1>Hello World</h1>");
  }, 1000);

  // Request code sync
  setTimeout(() => {
    console.log("\n📥 Client 2 Requesting Code Sync");

    client2.emit(CodeServiceMsg.SYNC_CODE);
  }, 2500);

  // Leave room
  setTimeout(() => {
    console.log("\n➡️ Client 2 Leaving");

    client2.emit(RoomServiceMsg.LEAVE);
  }, 4500);

  // Terminate room
  setTimeout(() => {
    console.log("\n💥 Client 1 Terminating Room");

    client1.emit(RoomServiceMsg.TERMINATE);
  }, 6500);

  // Try joining again
  setTimeout(() => {
    console.log("\n🔄 Client 2 Trying To Join Again");

    client2.emit(RoomServiceMsg.JOIN, roomId, "Deepak");
  }, 8500);
});

client2.on(RoomServiceMsg.SYNC_USERS, (users) => {
  console.log("👥 Client 2 Users:", users);
});

client2.on(CodeServiceMsg.UPDATE_CODE, (code: string) => {
  console.log("📄 Client 2 Received Code:", code);
});

client2.on(CodeServiceMsg.SYNC_CODE, (code: string) => {
  console.log("📄 Client 2 Synced Code:", code);
});

client2.on(RoomServiceMsg.TERMINATE, () => {
  console.log("💥 Client 2 Room Terminated");
});

client2.on(RoomServiceMsg.NOT_FOUND, (id: string) => {
  console.log("❌ Room Not Found:", id);
});

/* ---------------- Cleanup ---------------- */

process.on("SIGINT", () => {
  client1.disconnect();
  client2.disconnect();
  process.exit(0);
});
