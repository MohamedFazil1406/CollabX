import { z } from "zod";

/**
 * Edit operation
 * [text, startLineNumber, startColumn, endLineNumber, endColumn]
 */
export const EditOpSchema = z.tuple([
  z.string(),
  z.number(),
  z.number(),
  z.number(),
  z.number(),
]);

export type EditOp = z.infer<typeof EditOpSchema>;

/**
 * Cursor
 * [
 *   positionLineNumber,
 *   positionColumn,
 *   startLineNumber?,
 *   startColumn?,
 *   endLineNumber?,
 *   endColumn?
 * ]
 */
export const CursorSchema = z.tuple([
  z.number(),
  z.number(),
  z.number().optional(),
  z.number().optional(),
  z.number().optional(),
  z.number().optional(),
]);

export type Cursor = z.infer<typeof CursorSchema>;
