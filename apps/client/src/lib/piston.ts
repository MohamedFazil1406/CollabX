import type { ExecutionResult } from "@collabx/types";

interface ExecuteCodeRequest {
  language: string;
  code: string;
  version?: string;
  stdin?: string;
}

export async function executeCode({
  language,
  code,
  version = "*",
  stdin = "",
}: ExecuteCodeRequest): Promise<ExecutionResult> {
  const response = await fetch("/api/piston/execute", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      language,
      version,
      code,
      stdin,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to execute code");
  }

  return response.json();
}
