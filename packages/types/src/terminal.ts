import { z } from "zod";

/**
 * Execution result type
 */
export const ExecutionResultTypeSchema = z.enum([
  "info",
  "warning",
  "error",
  "output",
]);

export type ExecutionResultType = z.infer<typeof ExecutionResultTypeSchema>;

/**
 * Run result
 */
export const RunResultSchema = z.object({
  stdout: z.string(),
  stderr: z.string(),
  code: z.number(),
  signal: z.string().nullable(),
  output: z.string(),
});

export type RunResult = z.infer<typeof RunResultSchema>;

/**
 * Execution result
 */
export const ExecutionResultSchema = z.object({
  executionTime: z.number().optional(),
  language: z.string(),
  run: RunResultSchema,
  timestamp: z.date().optional(),
  type: ExecutionResultTypeSchema.optional(),
  version: z.string(),
});

export type ExecutionResult = z.infer<typeof ExecutionResultSchema>;
