import { create } from "zustand";
import type { ExecutionResult } from "@collabx/types";

interface TerminalStore {
  output: ExecutionResult | null;
  executing: boolean;

  setOutput: (output: ExecutionResult | null) => void;
  setExecuting: (executing: boolean) => void;
  clear: () => void;
}

export const useTerminalStore = create<TerminalStore>((set) => ({
  output: null,
  executing: false,

  setOutput: (output) =>
    set({
      output,
    }),

  setExecuting: (executing) =>
    set({
      executing,
    }),

  clear: () =>
    set({
      output: null,
      executing: false,
    }),
}));
