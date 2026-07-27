"use client";

import { useMemo } from "react";

import { useExplorerStore } from "@/store/explorer";

export function useActiveFile() {
  const { files, activeFileId, updateContent, setActiveFile, openFile } =
    useExplorerStore();

  const activeFile = useMemo(
    () => files.find((file) => file.id === activeFileId) ?? null,
    [files, activeFileId],
  );

  const setContent = (content: string) => {
    if (!activeFile) return;

    updateContent(activeFile.id, content);
  };

  return {
    activeFile,
    setContent,
    setActiveFile,
    openFile,
  };
}
