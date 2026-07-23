import {
  RoomServiceMsg,
  CodeServiceMsg,
  PointerServiceMsg,
  ScrollServiceMsg
  type Scroll,
  type Pointer,
  type Cursor,
  type EditOp,
  type ClientToServerEvents,
  type ServerToClientEvents,
} from "@collabx/types";

import { Server } from "socket.io";
import { App } from "uWebSockets.js";
console.log("uWS loaded successfully");

import * as roomService from "./services/room-service";
import * as userService from "@/services/user-service";
import * as codeService from "@/services/code-service";
import * as pointerService from "@/services/pointer-service";
import * as scrollService from "@/services/scroll-service"

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

  socket.on(RoomServiceMsg.CREATE, async (name: string) =>
    roomService.create(socket, name),
  );

  socket.on(RoomServiceMsg.JOIN, async (roomID: string, name: string) =>
    roomService.join(socket, io, roomID, name),
  );
  socket.on(RoomServiceMsg.LEAVE, async () => roomService.leave(socket, io));
  socket.on(RoomServiceMsg.TERMINATE, async () =>
    roomService.terminate(socket, io),
  );
  socket.on(RoomServiceMsg.SYNC_USERS, async () =>
    roomService.getUsersInRoom(socket, io),
  );
  socket.on(CodeServiceMsg.SYNC_CODE, async () =>
    codeService.syncCode(socket, io),
  );
  socket.on(CodeServiceMsg.UPDATE_LANG, async (langID: string) =>
    codeService.updateLang(socket, langID),
  );
  socket.on(CodeServiceMsg.UPDATE_CURSOR, async (cursor: Cursor) =>
    userService.updateCursor(socket, cursor),
  );
  socket.on(CodeServiceMsg.UPDATE_CODE, async (op: EditOp) =>
    codeService.updateCode(socket, op),
  );
   socket.on(ScrollServiceMsg.UPDATE_SCROLL, async (scroll: Scroll) =>
     scrollService.updateScroll(socket, scroll),
   );
  socket.on(PointerServiceMsg.POINTER, (pointer: Pointer) =>
    pointerService.updatePointer(socket, pointer),
  );
  socket.on("disconnecting", () => roomService.leave(socket, io));
});
