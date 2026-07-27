import { z } from "zod";

export const ExplorerFileSchema = z.object({
  id: z.string(),
  name: z.string(),
  language: z.string(),
  content: z.string(),
});

export type ExplorerFile = z.infer<typeof ExplorerFileSchema>;

export const FileCreateSchema = z.object({
  roomId: z.string(),
  file: ExplorerFileSchema,
});

export type FileCreate = z.infer<typeof FileCreateSchema>;

export const FileRenameSchema = z.object({
  roomId: z.string(),
  fileId: z.string(),
  name: z.string(),
  language: z.string(),
});

export type FileRename = z.infer<typeof FileRenameSchema>;

export const FileDeleteSchema = z.object({
  roomId: z.string(),
  fileId: z.string(),
});

export type FileDelete = z.infer<typeof FileDeleteSchema>;

export const FileUpdateSchema = z.object({
  roomId: z.string(),
  fileId: z.string(),
  content: z.string(),
});

export type FileUpdate = z.infer<typeof FileUpdateSchema>;

export const FileSyncSchema = z.object({
  roomId: z.string(),
});

export type FileSync = z.infer<typeof FileSyncSchema>;

export enum FileServiceMsg {
  CREATE = "file:create",
  DELETE = "file:delete",
  RENAME = "file:rename",
  UPDATE = "file:update",
  SYNC = "file:sync",
  SYNC_ALL = "file:sync_all",
}
