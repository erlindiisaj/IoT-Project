import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { APIClient } from "src/apiClient";
import type {
  IComponentsData,
  updateComponentValue,
} from "@interfaces/IComponents";

export const useComponents = (id?: number) => {
  const queryClient = useQueryClient();

  const apiClientAll = new APIClient<IComponentsData>(
    "rooms/get/all/components/values"
  );

  const apiClientUpdate = new APIClient<IComponentsData>(
    "components/update/value"
  );

  const getAllComponents = useQuery<IComponentsData[], Error>({
    queryFn: () => apiClientAll.getAllById(id!),
    queryKey: ["COMPONENTS_API_KEY_ALL", id],
    enabled: typeof id === "number",
  });

  const updateComponentValue = useMutation<
    IComponentsData,
    Error,
    updateComponentValue
  >({
    mutationFn: (updatedComponent) =>
      apiClientUpdate.put(updatedComponent.id, updatedComponent),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["COMPONENTS_API_KEY_ALL", id],
      });
    },
  });

  return {
    getAllComponents,
    updateComponentValue,
  };
};
