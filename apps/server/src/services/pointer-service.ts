import { PointerServiceMsg } from "@collabx/types";
import type { Pointer } from "@collabx/types";
import type { Socket } from "@/types";

import { getUserRoom } from "./room-service";
import { getCustomId } from "./user-service";

export const updatePointer = (socket: Socket, pointer: Pointer) => {
  const roomID = getUserRoom(socket);
  if (!roomID) {
    return;
  }

  const customId = getCustomId(socket.id);
  if (customId) {
    socket.to(roomID).emit(PointerServiceMsg.POINTER, customId, pointer);
  }
};
