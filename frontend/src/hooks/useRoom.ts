import {
  useQueryClient,
  useMutation,
  useSuspenseQuery,
} from "@tanstack/react-query";

import { APIClient } from "src/apiClient";
import type { IRoom, createRoomDTO, updateRoomDTO } from "@interfaces/IRoom";

export const useRoom = () => {
  const queryClient = useQueryClient();
  const apiClient = new APIClient<IRoom>("rooms/get/all");
  const apiUpdateClient = new APIClient<IRoom>("rooms/update/mode");

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

  const updateRoom = useMutation<IRoom, Error, updateRoomDTO>({
    mutationFn: (payload) => apiUpdateClient.put(payload.id, payload),
    mutationKey: ["UPDATE_ROOM"],
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["ROOM_API_KEY"] });
    },
  });

  return {
    getRooms,
    createRoom,
    updateRoom,
  };
};
