import { z } from "zod";

export const PointerSchema = z.tuple([
  z.number(), // x-coordinate
  z.number(), // y-coordinate
]);

export type Pointer = z.infer<typeof PointerSchema>;
