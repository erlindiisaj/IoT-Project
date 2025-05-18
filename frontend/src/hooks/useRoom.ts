import {
  useQueryClient,
  useMutation,
  useSuspenseQuery,
} from "@tanstack/react-query";

import { APIClient } from "src/apiClient";
import type { IRoom, createRoomDTO } from "@interfaces/IRoom";

import { _rooms } from "src/_mock";

export const useRoom = () => {
  const queryClient = useQueryClient();
  const apiClient = new APIClient<IRoom>("rooms");

  const getRooms = useSuspenseQuery<IRoom[], Error>({
    queryFn: () => apiClient.getAll(),
    queryKey: ["ROOM_API_KEY"],
  });

  const getRoomsTest = useSuspenseQuery<IRoom[], Error>({
    queryFn: () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(_rooms);
        }, 2000);
      }),
    queryKey: ["ROOM_API_KEY"],
  });

  const createRoom = useMutation<IRoom, Error, createRoomDTO>({
    mutationFn: (payload: createRoomDTO) => apiClient.post(payload),
    mutationKey: ["CREATE_ROOM"],
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["ROOM_API_KEY"] });
    },
  });

  return {
    getRoomsTest,
    getRooms,
    createRoom,
  };
};
