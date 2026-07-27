import { create } from "zustand";

interface NotesStore {
  note: string;

  setNote: (note: string) => void;

  clear: () => void;
}

export const useNotesStore = create<NotesStore>((set) => ({
  note: "",

  setNote: (note) =>
    set({
      note,
    }),

  clear: () =>
    set({
      note: "",
    }),
}));
