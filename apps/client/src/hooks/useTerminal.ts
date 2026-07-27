"use client";

import { useEffect } from "react";

import { socket } from "@/socket/client";
import { useTerminalStore } from "@/store/terminal";

import { CodeServiceMsg, type ExecutionResult } from "@collabx/types";

export function useTerminal() {
  const { setOutput, setExecuting } = useTerminalStore();

  useEffect(() => {
    const handleExec = (executing: boolean) => {
      setExecuting(executing);
    };

    const handleTerminal = (result: ExecutionResult) => {
      setOutput(result);
    };

    socket.on(CodeServiceMsg.EXEC, handleExec);
    socket.on(CodeServiceMsg.UPDATE_TERM, handleTerminal);

    return () => {
      socket.off(CodeServiceMsg.EXEC, handleExec);
      socket.off(CodeServiceMsg.UPDATE_TERM, handleTerminal);
    };
  }, [setOutput, setExecuting]);
}
