import type { Socket, Server } from "@/types";
import { generateRoomID } from "@/utils/generate-room-id";
import { RoomServiceMsg } from "@collabx/types";
import { normalizeRoomId } from "@/utils/normalise-room-id";

const roomExist = new Map<string, string>();

const roomUsersCache = new Map<string, Record<string, string>>();

export const getUserRoom = (socket: Socket): string | undefined => {
  // Socket.rooms is a Set, so we convert to array only for room access
  for (const room of socket.rooms) {
    if (room !== socket.id) {
      return room;
    }
  }
  return undefined;
};

export const create = async (socket: Socket, name: string): Promise<void> => {
  let roomId: string;

  do {
    roomId = generateRoomID();
  } while (roomExist.has(roomId));

  await socket.join(roomId);

  socket.emit(RoomServiceMsg.CREATE, roomId, name);
};

export const join = async (
  socket: Socket,
  io: Server,
  roomID: string,
  name: string,
): Promise<void> => {
  const normalizedRoomID = normalizeRoomId(roomID);

  const isActiveRoom = io.sockets.adapter.rooms.has(normalizedRoomID);

  console.log("Is room Active:", isActiveRoom);

  if (!isActiveRoom) {
    socket.emit(RoomServiceMsg.NOT_FOUND, normalizedRoomID);
    return;
  }

  await socket.join(normalizedRoomID);

  const room = io.sockets.adapter.rooms.get(normalizedRoomID);
  const users: Record<string, string> = room
    ? Object.fromEntries(
        Array.from(room).map((socketId) => [socketId, socketId]),
      )
    : {};

  socket.emit(RoomServiceMsg.JOIN, normalizedRoomID);
  socket.to(normalizedRoomID).emit(RoomServiceMsg.SYNC_USERS, users);
};

export const getUsersInRoom = (
  socket: Socket,
  io: Server,
  roomID: string = getUserRoom(socket) ?? "",
): Record<string, string> => {
  if (!roomID) {
    return {};
  }

  let users = roomUsersCache.get(roomID);

  // If not in cache, rebuild it
  if (!users) {
    const room = io.sockets.adapter.rooms.get(roomID);
    if (!room) {
      return {};
    }

    users = Object.fromEntries(
      Array.from(room).map((socketId) => [socketId, socketId]),
    );
    roomUsersCache.set(roomID, users);
  }

  io.to(socket.id).emit(RoomServiceMsg.SYNC_USERS, users);
  return users;
};
