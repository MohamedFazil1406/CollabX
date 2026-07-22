import {
  RoomServiceMsg,
  type ClientToServerEvents,
  type ServerToClientEvents,
} from "@collabx/types";

import { Server } from "socket.io";
import { App } from "uWebSockets.js";
console.log("uWS loaded successfully");

import * as roomService from "./services/room-service";

const PORT = 3000;

const app = App();

const io = new Server<ClientToServerEvents, ServerToClientEvents>({});

io.attachApp(app);

io.engine.on("connection", (rawSocket) => {
  rawSocket.request = null;
});

app.listen(PORT, (token) => {
  if (!token) {
    console.log(`Port ${PORT} is already in use`);
  }
  console.log(`collabx-server listening on port: ${PORT}`);
});

app.get("/", (res, req) => {
  const origin = req.getHeader("origin");

  res.writeHeader("Content-Type", "text/plain");

  res.end("Hello from collabx-server!.");
});

io.on("connection", (socket) => {
  socket.on("ping", () => socket.emit("pong"));

  socket.on(RoomServiceMsg.CREATE, async (name: string) => {
    roomService.create(socket, name);
  });
});
