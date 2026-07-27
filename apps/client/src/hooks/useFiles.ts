import { useEffect } from "react";

import { FileServiceMsg, type ExplorerFile } from "@collabx/types";

import { socket } from "@/socket/client";
import { useRoomStore } from "@/store/room";
import { useExplorerStore } from "@/store/explorer";

export function useFiles() {
  const roomId = useRoomStore((state) => state.roomId);

  const { setFiles, createFile, renameFile, deleteFile, updateContent } =
    useExplorerStore();

  useEffect(() => {
    if (!roomId) return;

    socket.emit(FileServiceMsg.SYNC, {
      roomId,
    });

    const onSync = (files: ExplorerFile[]) => {
      setFiles(files);
    };

    const onCreate = (file: ExplorerFile) => {
      createFile(file);
    };

    const onRename = ({
      fileId,
      name,
      language,
    }: {
      fileId: string;
      name: string;
      language: string;
    }) => {
      renameFile(fileId, name, language);
    };

    const onDelete = ({ fileId }: { fileId: string }) => {
      deleteFile(fileId);
    };

    const onUpdate = ({
      fileId,
      content,
    }: {
      fileId: string;
      content: string;
    }) => {
      updateContent(fileId, content);
    };

    socket.on(FileServiceMsg.SYNC_ALL, onSync);
    socket.on(FileServiceMsg.CREATE, onCreate);
    socket.on(FileServiceMsg.RENAME, onRename);
    socket.on(FileServiceMsg.DELETE, onDelete);
    socket.on(FileServiceMsg.UPDATE, onUpdate);

    return () => {
      socket.off(FileServiceMsg.SYNC_ALL, onSync);
      socket.off(FileServiceMsg.CREATE, onCreate);
      socket.off(FileServiceMsg.RENAME, onRename);
      socket.off(FileServiceMsg.DELETE, onDelete);
      socket.off(FileServiceMsg.UPDATE, onUpdate);
    };
  }, [roomId, setFiles, createFile, renameFile, deleteFile, updateContent]);
}
