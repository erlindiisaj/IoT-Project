import type { IRoom } from "@interfaces/IRoom";
import { create } from "zustand";

interface SensorsStore {
  room: IRoom | null;

  setRoom: (room: IRoom) => void;
}

export const useSensorsStore = create<SensorsStore>((set) => ({
  room: null,
  setRoom: (room: IRoom) => {
    set({ room });
  },
}));
