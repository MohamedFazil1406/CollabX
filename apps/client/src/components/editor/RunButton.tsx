"use client";

import { Play } from "lucide-react";

import { executeCode } from "@/lib/piston";
import { pistonLanguageMap } from "@/lib/pistonLanguage";
import { useExplorerStore } from "@/store/explorer";
import { useTerminalStore } from "@/store/terminal";

export default function RunButton() {
  const activeFile = useExplorerStore((state) =>
    state.files.find((file) => file.id === state.activeFileId),
  );

  const setOutput = useTerminalStore((state) => state.setOutput);
  const executing = useTerminalStore((state) => state.executing);
  const setExecuting = useTerminalStore((state) => state.setExecuting);

  async function handleRun() {
    if (!activeFile) return;

    try {
      setExecuting(true);

      const result = await executeCode({
        language: pistonLanguageMap[activeFile.language] ?? activeFile.language,
        code: activeFile.content,
      });

      setOutput(result);
    } catch (error) {
      setOutput({
        language: activeFile.language,
        version: "",
        run: {
          stdout: "",
          stderr: error instanceof Error ? error.message : "Execution failed",
          code: 1,
          signal: null,
          output: "",
        },
      });
    } finally {
      setExecuting(false);
    }
  }

  return (
    <button
      onClick={handleRun}
      disabled={executing}
      className="flex items-center gap-2 rounded-md bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700 disabled:opacity-50"
    >
      <Play size={16} />
      {executing ? "Running..." : "Run"}
    </button>
  );
}
