import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@collabx/types";
import type { Server as IOServer, Socket as IOSocket } from "socket.io";

export type Server = IOServer<ClientToServerEvents, ServerToClientEvents>;
export type Socket = IOSocket<ClientToServerEvents, ServerToClientEvents>;
