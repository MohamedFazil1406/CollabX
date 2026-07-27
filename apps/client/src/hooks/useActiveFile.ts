"use client";

import { useCallback, useMemo } from "react";

import { useExplorerStore } from "@/store/explorer";

export function useActiveFile() {
  const { files, activeFileId, updateContent, setActiveFile, openFile } =
    useExplorerStore();

  const activeFile = useMemo(
    () => files.find((file) => file.id === activeFileId) ?? null,
    [files, activeFileId],
  );

  const setContent = useCallback(
    (content: string) => {
      if (!activeFile) return;

      updateContent(activeFile.id, content);
    },
    [activeFile, updateContent],
  );

  return {
    activeFile,
    setContent,
    setActiveFile,
    openFile,
  };
}
