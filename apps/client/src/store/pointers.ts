import { create } from "zustand";
import type { Pointer } from "@collabx/types";

interface PointerStore {
  pointers: Record<string, Pointer>;

  updatePointer: (id: string, pointer: Pointer) => void;

  removePointer: (id: string) => void;

  clearPointers: () => void;
}

export const usePointerStore = create<PointerStore>((set) => ({
  pointers: {},

  updatePointer: (id, pointer) =>
    set((state) => ({
      pointers: {
        ...state.pointers,
        [id]: pointer,
      },
    })),

  removePointer: (id) =>
    set((state) => {
      const next = { ...state.pointers };
      delete next[id];

      return {
        pointers: next,
      };
    }),

  clearPointers: () =>
    set({
      pointers: {},
    }),
}));
