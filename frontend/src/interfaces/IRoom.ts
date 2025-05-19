export interface IRoom {
  id: number;
  name: string;
  arduino_id: number;
  mode: number | string;
}

export type createRoomDTO = Omit<IRoom, "id">;

export type updateRoomDTO = Omit<IRoom, "arduino_id" | "name">;
