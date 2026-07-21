import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@collabx/types/dist";

import { Server } from "socket.io";
import { App } from "uWebSockets.js";

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
