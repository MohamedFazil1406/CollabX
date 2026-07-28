"use client";

import { useCallback, useState } from "react";

import { useActiveFile } from "./useActiveFile";
import { useExplorerStore } from "@/store/explorer";

export function useGithubSave() {
  const { activeFile } = useActiveFile();

  const files = useExplorerStore((s) => s.files);
  const setFiles = useExplorerStore((s) => s.setFiles);

  const [isSaving, setIsSaving] = useState(false);

  const save = useCallback(async () => {
    if (!activeFile?.github) {
      throw new Error("Active file is not a GitHub file.");
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/github/save", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          owner: activeFile.github.owner,
          repo: activeFile.github.repo,
          path: activeFile.github.path,
          sha: activeFile.github.sha,
          content: activeFile.content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Failed to save file.");
      }

      // GitHub returns the new blob SHA after every commit.
      const updatedFiles = files.map((file) =>
        file.id === activeFile.id
          ? {
              ...file,
              github: file.github
                ? {
                    ...file.github,
                    sha: data.content.sha,
                  }
                : undefined,
            }
          : file,
      );

      setFiles(updatedFiles);

      return data;
    } finally {
      setIsSaving(false);
    }
  }, [activeFile, files, setFiles]);

  return {
    save,
    isSaving,
  };
}
