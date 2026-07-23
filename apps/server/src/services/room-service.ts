import type { Socket, Server } from "@/types";
import { generateRoomID } from "@/utils/generate-room-id";
import { RoomServiceMsg } from "@collabx/types";
import { normalizeRoomId } from "@/utils/normalise-room-id";
import * as userService from "@/services/user-service";

const roomExist = new Map<string, string>();

const roomUsersCache = new Map<string, Record<string, string>>();

const roomNotes = new Map<string, string>();

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
  const customID = userService.connect(socket, name);
  let roomId: string;

  do {
    roomId = generateRoomID();
  } while (roomExist.has(roomId));

  await socket.join(roomId);
  roomUsersCache.set(roomId, { [customID]: name });
  socket.emit(RoomServiceMsg.CREATE, roomId, customID);
};

export const join = async (
  socket: Socket,
  io: Server,
  roomID: string,
  name: string,
): Promise<void> => {
  const normalizedRoomID = normalizeRoomId(roomID);

  const isActiveRoom = io.sockets.adapter.rooms.has(normalizedRoomID);

  if (!isActiveRoom) {
    socket.emit(RoomServiceMsg.NOT_FOUND, normalizedRoomID);
    return;
  }

  const customId = userService.connect(socket, name);

  await socket.join(normalizedRoomID);

  const users = roomUsersCache.get(normalizedRoomID) || {};
  users[customId] = name;
  roomUsersCache.set(normalizedRoomID, users);

  socket.emit(RoomServiceMsg.JOIN, customId);
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

    users = {};
    for (const socketId of room) {
      const username = userService.getUsername(socketId);
      const sock = io.sockets.sockets.get(socketId);
      if (!sock) {
        continue;
      }
      const customId = userService.getSocCustomId(sock);
      if (username && customId) {
        users[customId] = username;
      }
    }
    roomUsersCache.set(roomID, users);
  }

  io.to(socket.id).emit(RoomServiceMsg.SYNC_USERS, users);
  return users;
};

export const leave = async (socket: Socket, io: Server): Promise<void> => {
  try {
    if (!socket || socket.disconnected) {
      return;
    }

    const roomID = getUserRoom(socket);
    if (!roomID) {
      return;
    }

    const customId = userService.getSocCustomId(socket);
    if (!customId) {
      return;
    }

    const users = roomUsersCache.get(roomID);
    if (users) {
      if (Object.keys(users).length === 0) {
        roomUsersCache.delete(roomID);
      } else {
        roomUsersCache.set(roomID, users);
      }
    }

    if (io.sockets.adapter.rooms.has(roomID)) {
      socket.to(roomID).emit(RoomServiceMsg.LEAVE, socket.id);
      socket.to(roomID).emit(RoomServiceMsg.SYNC_USERS, users || {});
    }

    await socket.leave(roomID);
    userService.disconnect(socket);
  } catch {
    return;
  }
};

export const cleanupRoomCache = (roomID: string): void => {
  roomUsersCache.delete(roomID);
  roomNotes.delete(roomID);
};

export const terminate = (socket: Socket, io: Server): void => {
  const roomID = getUserRoom(socket);
  if (!roomID) {
    return;
  }

  socket.to(roomID).emit(RoomServiceMsg.TERMINATE);

  const room = io.sockets.adapter.rooms.get(roomID);
  if (room) {
    for (const socketId of room) {
      const sock = io.sockets.sockets.get(socketId);
      if (sock) {
        userService.disconnect(socket);
        sock.leave(roomID);
      }
    }
  }

  // Clean up all room data immediately (no grace period)
  cleanupRoomCache(roomID);
};
