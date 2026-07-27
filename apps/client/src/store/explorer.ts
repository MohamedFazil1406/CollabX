import { create } from "zustand";

export interface ExplorerFile {
  id: string;
  name: string;
  language: string;
  content: string;
}

interface ExplorerStore {
  files: ExplorerFile[];
  openTabs: string[];
  activeFileId: string | null;

  setFiles: (files: ExplorerFile[]) => void;
  createFile: (file: ExplorerFile) => void;
  deleteFile: (id: string) => void;
  renameFile: (id: string, name: string, language: string) => void;

  updateContent: (id: string, content: string) => void;

  openFile: (id: string) => void;
  closeTab: (id: string) => void;

  setActiveFile: (id: string) => void;
}

export const useExplorerStore = create<ExplorerStore>((set) => ({
  files: [],

  openTabs: [],

  activeFileId: null,

  setFiles: (files) =>
    set({
      files,
    }),

  createFile: (file) =>
    set((state) => ({
      files: [...state.files, file],
    })),

  deleteFile: (id) =>
    set((state) => ({
      files: state.files.filter((f) => f.id !== id),
      openTabs: state.openTabs.filter((tab) => tab !== id),
      activeFileId: state.activeFileId === id ? null : state.activeFileId,
    })),

  renameFile: (id, name, language) =>
    set((state) => ({
      files: state.files.map((file) =>
        file.id === id
          ? {
              ...file,
              name,
              language,
            }
          : file,
      ),
    })),

  updateContent: (id, content) =>
    set((state) => ({
      files: state.files.map((file) =>
        file.id === id
          ? {
              ...file,
              content,
            }
          : file,
      ),
    })),

  openFile: (id) =>
    set((state) => ({
      openTabs: state.openTabs.includes(id)
        ? state.openTabs
        : [...state.openTabs, id],
      activeFileId: id,
    })),

  closeTab: (id) =>
    set((state) => {
      const tabs = state.openTabs.filter((tab) => tab !== id);

      return {
        openTabs: tabs,
        activeFileId:
          state.activeFileId === id
            ? (tabs.at(-1) ?? null)
            : state.activeFileId,
      };
    }),

  setActiveFile: (id) =>
    set({
      activeFileId: id,
    }),
}));
