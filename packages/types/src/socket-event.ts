import { z } from "zod";

import {
  RoomServiceMsg,
  CodeServiceMsg,
  ScrollServiceMsg,
  StreamServiceMsg,
  PointerServiceMsg,
} from "./message";
import { EditOpSchema, CursorSchema } from "./operation";
import { ScrollSchema } from "./scroll";
import { PointerSchema } from "./pointer";
import { ExecutionResultSchema } from "./terminal";

export const ClientToServerSchemas = {
  ping: z.tuple([]),

  [RoomServiceMsg.CREATE]: z.tuple([z.string()]),
  [RoomServiceMsg.JOIN]: z.tuple([z.string(), z.string()]),
  [RoomServiceMsg.LEAVE]: z.tuple([]),
  [RoomServiceMsg.TERMINATE]: z.tuple([]),
  [RoomServiceMsg.SYNC_USERS]: z.tuple([]),
  [RoomServiceMsg.SYNC_MD]: z.tuple([]),
  [RoomServiceMsg.UPDATE_MD]: z.tuple([z.string()]),

  [CodeServiceMsg.SYNC_CODE]: z.tuple([]),
  [CodeServiceMsg.UPDATE_CODE]: z.tuple([EditOpSchema]),
  [CodeServiceMsg.UPDATE_CURSOR]: z.tuple([CursorSchema]),
  [CodeServiceMsg.SYNC_LANG]: z.tuple([]),
  [CodeServiceMsg.UPDATE_LANG]: z.tuple([z.string()]),
  [CodeServiceMsg.EXEC]: z.tuple([z.boolean()]),
  [CodeServiceMsg.UPDATE_TERM]: z.tuple([ExecutionResultSchema]),

  [ScrollServiceMsg.UPDATE_SCROLL]: z.tuple([ScrollSchema]),

  [StreamServiceMsg.STREAM_READY]: z.tuple([]),
  [StreamServiceMsg.SIGNAL]: z.tuple([
    z.object({
      signal: z.unknown(),
      targetUserID: z.string(),
    }),
  ]),
  [StreamServiceMsg.CAMERA_OFF]: z.tuple([]),
  [StreamServiceMsg.MIC_STATE]: z.tuple([z.boolean()]),
  [StreamServiceMsg.SPEAKER_STATE]: z.tuple([z.boolean()]),

  [PointerServiceMsg.POINTER]: z.tuple([PointerSchema]),
} as const;

export type ClientToServerEvents = {
  [K in keyof typeof ClientToServerSchemas]: (
    ...args: z.infer<(typeof ClientToServerSchemas)[K]>
  ) => void;
};

export const ServerToClientSchemas = {
  pong: z.tuple([]),

  [RoomServiceMsg.CREATE]: z.tuple([z.string(), z.string()]),
  [RoomServiceMsg.JOIN]: z.tuple([z.string()]),
  [RoomServiceMsg.NOT_FOUND]: z.tuple([z.string()]),
  [RoomServiceMsg.LEAVE]: z.tuple([z.string()]),
  [RoomServiceMsg.TERMINATE]: z.tuple([]),
  [RoomServiceMsg.SYNC_USERS]: z.tuple([z.record(z.string(), z.string())]),
  [RoomServiceMsg.UPDATE_MD]: z.tuple([z.string()]),

  [CodeServiceMsg.SYNC_CODE]: z.tuple([z.string()]),
  [CodeServiceMsg.UPDATE_CODE]: z.tuple([EditOpSchema]),
  [CodeServiceMsg.UPDATE_CURSOR]: z.tuple([z.string(), CursorSchema]),
  [CodeServiceMsg.UPDATE_LANG]: z.tuple([z.string()]),
  [CodeServiceMsg.EXEC]: z.tuple([z.boolean()]),
  [CodeServiceMsg.UPDATE_TERM]: z.tuple([ExecutionResultSchema]),

  [ScrollServiceMsg.UPDATE_SCROLL]: z.tuple([z.string(), ScrollSchema]),

  [StreamServiceMsg.USER_READY]: z.tuple([z.string()]),
  [StreamServiceMsg.SIGNAL]: z.tuple([
    z.object({
      userID: z.string(),
      signal: z.unknown(),
    }),
  ]),
  [StreamServiceMsg.CAMERA_OFF]: z.tuple([z.string()]),
  [StreamServiceMsg.MIC_STATE]: z.tuple([
    z.object({
      userID: z.string(),
      micOn: z.boolean(),
    }),
  ]),
  [StreamServiceMsg.SPEAKER_STATE]: z.tuple([
    z.object({
      userID: z.string(),
      speakersOn: z.boolean(),
    }),
  ]),

  [PointerServiceMsg.POINTER]: z.tuple([z.string(), PointerSchema]),
} as const;

export type ServerToClientEvents = {
  [K in keyof typeof ServerToClientSchemas]: (
    ...args: z.infer<(typeof ServerToClientSchemas)[K]>
  ) => void;
};
