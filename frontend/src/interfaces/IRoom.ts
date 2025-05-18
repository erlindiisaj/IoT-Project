export interface IRoom {
  id: number;
  name: string;
  arduino_id: number;
}

export type createRoomDTO = Omit<IRoom, "id">;
