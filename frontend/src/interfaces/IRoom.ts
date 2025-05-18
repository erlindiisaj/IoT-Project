export interface IRoom {
  id: number;
  name: string;
}

export type createRoomDTO = Omit<IRoom, "id">;
