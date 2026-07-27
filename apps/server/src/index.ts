import { SignalData } from "simple-peer";
import {
  FileServiceMsg,
  RoomServiceMsg,
  CodeServiceMsg,
  PointerServiceMsg,
  ScrollServiceMsg,
  StreamServiceMsg,
  type FileCreate,
  type FileRename,
  type FileDelete,
  type FileUpdate,
  type FileSync,
  type Scroll,
  type Pointer,
  type Cursor,
  type EditOp,
  type ClientToServerEvents,
  type ServerToClientEvents,
} from "@collabx/types";
import * as fileService from "@/services/file-service";
import {
  ALLOWED_ORIGINS,
  getCorsHeaders,
  isVercelDeployment,
} from "./cors-config";
import { Server } from "socket.io";
import { App } from "uWebSockets.js";
console.log("uWS loaded successfully");

import * as roomService from "./services/room-service";
import * as userService from "@/services/user-service";
import * as codeService from "@/services/code-service";
import * as pointerService from "@/services/pointer-service";
import * as scrollService from "@/services/scroll-service";
import * as webRTCService from "@/services/webrtc-service";

const PORT = 3001;

const app = App();

const io = new Server<ClientToServerEvents, ServerToClientEvents>({
  cors: {
    origin: (origin, callback) => {
      if (process.env.NODE_ENV === "development") {
        callback(null, true);
        return;
      }

      if (
        !origin ||
        ALLOWED_ORIGINS.includes(origin as (typeof ALLOWED_ORIGINS)[number]) ||
        isVercelDeployment(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error("Origin not allowed"));
      }
    },
    methods: ["GET", "POST"], // Socket.IO needs both
    credentials: true,
  },
  transports: ["websocket", "polling"],
  // Allow larger payloads for pasting large code blocks (default is 1MB)
  maxHttpBufferSize: 5e6, // 5MB
  // Recover socket state (rooms, missed packets) after brief disconnects
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
    skipMiddlewares: true,
  },
});

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
    roomService.create(socket, name, io),
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
  socket.on(StreamServiceMsg.STREAM_READY, () =>
    webRTCService.onStreamReady(socket),
  );
  socket.on(
    StreamServiceMsg.SIGNAL,
    (data: { signal: SignalData; targetUserID: string }) =>
      webRTCService.handleSignal(socket, data),
  );
  socket.on(StreamServiceMsg.CAMERA_OFF, () =>
    webRTCService.onCameraOff(socket),
  );
  socket.on(StreamServiceMsg.MIC_STATE, (micOn: boolean) =>
    webRTCService.handleMicState(socket, micOn),
  );
  socket.on(StreamServiceMsg.SPEAKER_STATE, (speakersOn: boolean) =>
    webRTCService.handleSpeakerState(socket, speakersOn),
  );
  socket.on(FileServiceMsg.CREATE, async (payload: FileCreate) =>
    fileService.createFile(socket, io, payload),
  );

  socket.on(FileServiceMsg.RENAME, async (payload: FileRename) =>
    fileService.renameFile(socket, io, payload),
  );

  socket.on(FileServiceMsg.DELETE, async (payload: FileDelete) =>
    fileService.deleteFile(socket, io, payload),
  );

  socket.on(FileServiceMsg.UPDATE, async (payload: FileUpdate) =>
    fileService.updateFile(socket, payload),
  );

  socket.on(FileServiceMsg.SYNC, async (payload: FileSync) =>
    fileService.syncFiles(socket, payload),
  );
  socket.on(PointerServiceMsg.POINTER, (pointer: Pointer) =>
    pointerService.updatePointer(socket, pointer),
  );
  socket.on("disconnecting", () => roomService.leave(socket, io));
});
