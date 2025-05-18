import {
  useQueryClient,
  useMutation,
  useSuspenseQuery,
} from "@tanstack/react-query";

import { APIClient } from "src/apiClient";
import type { IRoom, createRoomDTO } from "@interfaces/IRoom";

export const useRoom = () => {
  const queryClient = useQueryClient();
  const apiClient = new APIClient<IRoom>("rooms/get/all");

  const getRooms = useSuspenseQuery<IRoom[], Error>({
    queryFn: () => apiClient.getAll(),
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
    getRooms,
    createRoom,
  };
};
