import type { IRoom } from "@interfaces/IRoom";
import { create } from "zustand";

export interface Sensor {
  id: number;
  type: string;
  pin?: number;
  room: number;
  value: string | number;
}
export interface SensorsStore {
  room: IRoom | null;
  sensors: {
    led: Sensor;
    pir: Sensor;
    motor: Sensor;
    dht: Sensor;
    ldr: Sensor;
    dht_humidity: Sensor;
  };
  loading: boolean;
  setSensors: (sensors: Partial<SensorsStore["sensors"]>) => void;
  setRoom: (room: IRoom) => void;
  setLoading: (loading: boolean) => void;
}

export const useSensorsStore = create<SensorsStore>((set) => ({
  room: null,
  loading: true,
  sensors: {
    led: {
      id: 1,
      type: "led",
      pin: 1,
      room: 1,
      value: 0,
    },
    ldr: {
      id: 2,
      type: "ldr",
      pin: 2,
      room: 1,
      value: 0,
    },
    pir: {
      id: 3,
      type: "pir",
      pin: 3,
      room: 1,
      value: 0,
    },
    motor: {
      id: 4,
      type: "motor",
      pin: 4,
      room: 1,
      value: 0,
    },
    dht: {
      id: 5,
      type: "dht",
      pin: 5,
      room: 1,
      value: 0,
    },
    dht_humidity: {
      id: 6,
      type: "dht_humidity",
      pin: 6,
      room: 1,
      value: 0,
    },
  },
  setSensors: (sensors: Partial<SensorsStore["sensors"]>) => {
    set((state) => ({
      sensors: {
        ...state.sensors,
        ...sensors,
      },
    }));
  },

  setRoom: (room: IRoom) => {
    set({ room });
  },
  setLoading: (loading: boolean) => set({ loading }),
}));
