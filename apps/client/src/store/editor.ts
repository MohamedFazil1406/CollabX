import { create } from "zustand";

interface EditorStore {
  language: string;
  setLanguage: (lang: string) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  language: "html",
  setLanguage: (language) => set({ language }),
}));
