"use client";

import { useEffect, useRef } from "react";

import { useTerminal } from "@/hooks/useTerminal";
import { useTerminalStore } from "@/store/terminal";

export default function TerminalPanel() {
  useTerminal();

  const { output, executing } = useTerminalStore();

  const outputRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (!outputRef.current) return;

    outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [output]);

  return (
    <div className="flex h-64 flex-col overflow-hidden border-t border-zinc-800 bg-zinc-950">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 py-2">
        <span className="font-medium text-white">Terminal</span>

        <span
          className={`rounded px-2 py-1 text-xs ${
            executing
              ? "bg-yellow-500/20 text-yellow-400"
              : "bg-green-500/20 text-green-400"
          }`}
        >
          {executing ? "Running..." : "Idle"}
        </span>
      </div>

      {/* Output */}
      <pre
        ref={outputRef}
        className="flex-1 overflow-auto whitespace-pre-wrap p-4 font-mono text-sm text-zinc-200"
      >
        {output ? (
          <>
            {output.run.stdout && (
              <div className="mb-2 text-green-400">{output.run.stdout}</div>
            )}

            {output.run.stderr && (
              <div className="mb-2 text-red-400">{output.run.stderr}</div>
            )}

            {output.type === "error" && output.type && (
              <div className="text-red-500">{output.type}</div>
            )}
          </>
        ) : (
          <span className="text-zinc-500">No execution output yet...</span>
        )}
      </pre>
    </div>
  );
}
