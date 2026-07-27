import { Server, Socket } from "socket.io";

import {
  ExplorerFile,
  FileCreate,
  FileDelete,
  FileRename,
  FileServiceMsg,
  FileSync,
  FileUpdate,
} from "@collabx/types";

const roomFiles = new Map<string, ExplorerFile[]>();

export function createFile(
  socket: Socket,
  io: Server,
  { roomId, file }: FileCreate,
) {
  const files = roomFiles.get(roomId) ?? [];

  files.push(file);

  roomFiles.set(roomId, files);

  io.to(roomId).emit(FileServiceMsg.CREATE, file);
}

export function renameFile(
  socket: Socket,
  io: Server,
  { roomId, fileId, name, language }: FileRename,
) {
  const files = roomFiles.get(roomId);

  if (!files) return;

  const file = files.find((f) => f.id === fileId);

  if (!file) return;

  file.name = name;
  file.language = language;

  io.to(roomId).emit(FileServiceMsg.RENAME, {
    fileId,
    name,
    language,
  });
}

export function deleteFile(
  socket: Socket,
  io: Server,
  { roomId, fileId }: FileDelete,
) {
  const files = roomFiles.get(roomId);

  if (!files) return;

  roomFiles.set(
    roomId,
    files.filter((f) => f.id !== fileId),
  );

  io.to(roomId).emit(FileServiceMsg.DELETE, {
    fileId,
  });
}

export function updateFile(
  socket: Socket,
  { roomId, fileId, content }: FileUpdate,
) {
  const files = roomFiles.get(roomId);

  if (!files) return;

  const file = files.find((f) => f.id === fileId);

  if (!file) return;

  file.content = content;

  socket.to(roomId).emit(FileServiceMsg.UPDATE, {
    fileId,
    content,
  });
}

export function syncFiles(socket: Socket, { roomId }: FileSync) {
  const files = roomFiles.get(roomId) ?? [];

  socket.emit(FileServiceMsg.SYNC_ALL, files);
}
