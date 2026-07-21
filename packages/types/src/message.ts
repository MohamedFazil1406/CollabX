import { z } from "zod";

export const RoomServiceMsg = {
  CREATE: "A",
  JOIN: "B",
  LEAVE: "C",
  NOT_FOUND: "D",
  SYNC_USERS: "E",
  SYNC_MD: "F",
  UPDATE_MD: "G",
  TERMINATE: "Y",
} as const;

export const RoomServiceMsgSchema = z.enum([
  RoomServiceMsg.CREATE,
  RoomServiceMsg.JOIN,
  RoomServiceMsg.LEAVE,
  RoomServiceMsg.NOT_FOUND,
  RoomServiceMsg.SYNC_USERS,
  RoomServiceMsg.SYNC_MD,
  RoomServiceMsg.UPDATE_MD,
  RoomServiceMsg.TERMINATE,
]);

export type RoomServiceMsgType = z.infer<typeof RoomServiceMsgSchema>;

export const CodeServiceMsg = {
  SYNC_CODE: "H",
  UPDATE_CODE: "I",
  UPDATE_CURSOR: "J",
  SYNC_LANG: "K",
  UPDATE_LANG: "L",
  EXEC: "M",
  UPDATE_TERM: "N",
} as const;

export const CodeServiceMsgSchema = z.enum([
  CodeServiceMsg.SYNC_CODE,
  CodeServiceMsg.UPDATE_CODE,
  CodeServiceMsg.UPDATE_CURSOR,
  CodeServiceMsg.SYNC_LANG,
  CodeServiceMsg.UPDATE_LANG,
  CodeServiceMsg.EXEC,
  CodeServiceMsg.UPDATE_TERM,
]);

export type CodeServiceMsgType = z.infer<typeof CodeServiceMsgSchema>;

export const ScrollServiceMsg = {
  UPDATE_SCROLL: "O",
} as const;

export const ScrollServiceMsgSchema = z.enum([ScrollServiceMsg.UPDATE_SCROLL]);

export type ScrollServiceMsgType = z.infer<typeof ScrollServiceMsgSchema>;

export const StreamServiceMsg = {
  USER_READY: "P",
  STREAM_READY: "Q",
  SIGNAL: "R",
  STREAM: "S",
  USER_DISCONNECTED: "T",
  CAMERA_OFF: "U",
  MIC_STATE: "V",
  SPEAKER_STATE: "W",
} as const;

export const StreamServiceMsgSchema = z.enum([
  StreamServiceMsg.USER_READY,
  StreamServiceMsg.STREAM_READY,
  StreamServiceMsg.SIGNAL,
  StreamServiceMsg.STREAM,
  StreamServiceMsg.USER_DISCONNECTED,
  StreamServiceMsg.CAMERA_OFF,
  StreamServiceMsg.MIC_STATE,
  StreamServiceMsg.SPEAKER_STATE,
]);

export type StreamServiceMsgType = z.infer<typeof StreamServiceMsgSchema>;

export const PointerServiceMsg = {
  POINTER: "X",
} as const;

export const PointerServiceMsgSchema = z.enum([PointerServiceMsg.POINTER]);

export type PointerServiceMsgType = z.infer<typeof PointerServiceMsgSchema>;
