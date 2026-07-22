import { io } from "socket.io-client";
import { RoomServiceMsg } from "@collabx/types";

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("Connected!");

  socket.emit(RoomServiceMsg.CREATE, "Mohamed");
});

socket.on(RoomServiceMsg.CREATE, (roomId, name) => {
  console.log("Room ID:", roomId);
  console.log("Name:", name);
});
