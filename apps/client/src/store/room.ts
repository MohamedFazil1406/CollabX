import { create } from "zustand";

interface RoomStore {
  username: string;
  roomId: string;
  setUsername: (username: string) => void;
  setRoomId: (roomId: string) => void;
}

export const useRoomStore = create<RoomStore>((set) => ({
  username: "",
  roomId: "",
  setUsername: (username) => set({ username }),
  setRoomId: (roomId) => set({ roomId }),
}));
