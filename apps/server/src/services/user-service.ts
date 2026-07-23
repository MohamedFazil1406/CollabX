import { CodeServiceMsg } from "@collabx/types";
import type { Cursor } from "@collabx/types";
import type { Socket } from "@/types";

import { getUserRoom } from "./room-service";

interface UserData {
  customId: string;
  username: string;
}

// Core data structures optimized for O(1) lookups
const socketToUserData = new Map<string, UserData>();
const customIdToSocketId = new Map<string, string>();

const generateCustomId = (): string => {
  const generateId = (num: number): string => {
    let id = "";
    let remaining = num;
    while (remaining >= 0) {
      id = String.fromCharCode(65 + (remaining % 26)) + id;
      remaining = Math.floor(remaining / 26) - 1;
    }
    return id;
  };

  let counter = 0;
  let newId: string;

  // Find the next available ID
  do {
    newId = generateId(counter++);
  } while (customIdToSocketId.has(newId));

  return newId;
};

export const getUsername = (socketId: string): string | undefined => {
  return socketToUserData.get(socketId)?.username;
};

export const connect = (socket: Socket, username: string): string => {
  const customId = generateCustomId();
  const userData: UserData = { username, customId };

  socketToUserData.set(socket.id, userData);
  customIdToSocketId.set(customId, socket.id);

  return customId;
};

/**
 * Efficiently clean up user data on disconnect
 */
export const disconnect = (socket: Socket): void => {
  const userData = socketToUserData.get(socket.id);
  if (userData) {
    customIdToSocketId.delete(userData.customId);
    socketToUserData.delete(socket.id);
  }

  socket.disconnect();
};

/**
 * Optimized cursor update broadcasting
 */
export const updateCursor = (socket: Socket, cursor: Cursor): void => {
  const roomId = getUserRoom(socket);
  const userData = socketToUserData.get(socket.id);

  if (userData && roomId) {
    socket
      .to(roomId)
      .emit(CodeServiceMsg.UPDATE_CURSOR, userData.customId, cursor);
  }
};

/**
 * Get custom ID with O(1) lookup
 */
export const getSocCustomId = (socket: Socket): string | undefined => {
  return socketToUserData.get(socket.id)?.customId;
};

/**
 * Get socket ID from custom ID with O(1) lookup
 */
export const getSocketId = (customId: string): string | undefined => {
  return customIdToSocketId.get(customId);
};

/**
 * Get custom ID from socket ID with O(1) lookup
 */
export const getCustomId = (socketId: string): string | undefined => {
  return socketToUserData.get(socketId)?.customId;
};

/**
 * Check if custom ID exists with O(1) lookup
 */
export const isCustomIdInUse = (customId: string): boolean => {
  return customIdToSocketId.has(customId);
};
