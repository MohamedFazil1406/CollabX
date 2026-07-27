import { create } from "zustand";
import type { Cursor } from "@collabx/types";

interface CursorStore {
  cursors: Record<string, Cursor>;
  updateCursor: (id: string, cursor: Cursor) => void;
  removeCursor: (id: string) => void;
}

export const useCursorStore = create<CursorStore>((set) => ({
  cursors: {},

  updateCursor: (id, cursor) =>
    set((state) => ({
      cursors: {
        ...state.cursors,
        [id]: cursor,
      },
    })),

  removeCursor: (id) =>
    set((state) => {
      const next = { ...state.cursors };
      delete next[id];

      return {
        cursors: next,
      };
    }),
}));
