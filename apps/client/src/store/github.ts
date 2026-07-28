import { create } from "zustand";

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  default_branch: string;
  private: boolean;
}

export interface GithubOpenedFile {
  path: string;
  name: string;
  sha: string;
  content: string;
}

export interface GithubFile {
  name: string;
  path: string;
  type: "file" | "dir";
  sha: string;
  download_url: string | null;
}

interface GithubStore {
  repos: GithubRepo[];
  selectedRepo: GithubRepo | null;

  files: GithubFile[];

  openedFile: GithubOpenedFile | null;

  setRepos: (repos: GithubRepo[]) => void;
  selectRepo: (repo: GithubRepo) => void;
  setFiles: (files: GithubFile[]) => void;
  openFile: (file: GithubOpenedFile) => void;
}

export const useGithubStore = create<GithubStore>((set) => ({
  repos: [],
  selectedRepo: null,
  files: [],
  openedFile: null,

  setRepos: (repos) => set({ repos }),

  selectRepo: (repo) =>
    set({
      selectedRepo: repo,
      files: [], // Clear previous repo files when switching repositories
      openedFile: null,
    }),

  setFiles: (files) => set({ files }),

  openFile: (file) =>
    set({
      openedFile: file,
    }),
}));
