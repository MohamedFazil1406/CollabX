import { create } from "zustand";

interface UserStore {
  users: Record<string, string>;
  setUsers: (users: Record<string, string>) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  users: {},
  setUsers: (users) => set({ users }),
}));
