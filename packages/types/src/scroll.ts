import { z } from "zod";

export const ScrollSchema = z.tuple([
  z.number(), // scrollLeft
  z.number(), // scrollTop
]);

export type Scroll = z.infer<typeof ScrollSchema>;
