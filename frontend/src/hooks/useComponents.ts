import { useSuspenseQuery } from "@tanstack/react-query";
import { APIClient } from "src/apiClient";
import type { IRoom } from "@interfaces/IRoom";

export const useComponents = (id: number) => {
  const apiClient = new APIClient<IRoom>("components/get/room");
  const apiClientAll = new APIClient<IRoom>("components/data/get");

  const getComponents = useSuspenseQuery<IRoom, Error>({
    queryFn: () => apiClient.get(id),
    queryKey: ["COMPONENTS_API_KEY", id],
  });

  const getAllComponents = useSuspenseQuery<IRoom[], Error>({
    queryFn: () => apiClientAll.getAll(),
    queryKey: ["COMPONENTS_API_KEY_ALL"],
  });

  return {
    getComponents,
    getAllComponents,
  };
};
