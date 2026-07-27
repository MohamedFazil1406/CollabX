"use client";

import { useEffect } from "react";

import { useExplorerStore } from "@/store/explorer";

export function useFileShortcuts() {
  const { files, activeFileId, closeTab, createFile } = useExplorerStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + N → New File
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "n") {
        e.preventDefault();

        const name = `untitled-${files.length + 1}.txt`;

        createFile({
          id: crypto.randomUUID(),
          name,
          language: "plaintext",
          content: "",
        });

        return;
      }

      // Ctrl/Cmd + W → Close Active Tab
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "w") {
        e.preventDefault();

        if (activeFileId) {
          closeTab(activeFileId);
        }

        return;
      }

      // Ctrl/Cmd + S → Save (placeholder)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();

        console.log("Save file...");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [files.length, activeFileId, closeTab, createFile]);
}
