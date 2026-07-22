import type { Socket, Server } from "@/types";
import { generateRoomID } from "@/utils/generate-room-id";
import { RoomServiceMsg } from "@collabx/types";

const roomExist = new Map<string, string>();

export const create = async (socket: Socket, name: string): Promise<void> => {
  let roomId: string;

  do {
    roomId = generateRoomID();
  } while (roomExist.has(roomId));

  await socket.join(roomId);

  socket.emit(RoomServiceMsg.CREATE, roomId, name);
};
