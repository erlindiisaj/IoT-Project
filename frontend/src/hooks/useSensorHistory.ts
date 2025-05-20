import { useQuery, useQueryClient } from "@tanstack/react-query";
import { APIClient } from "src/apiClient";
import { transformSensorData } from "src/utils/chart-data-formater"; // Adjust path as needed

// Types
type BackendEntry = {
  id: number;
  action: string;
  mode: string;
  timestamp: string;
  previous_value: number;
  current_value: number;
  component: number;
};

export type BackendComponentData = {
  component_name: string;
  data: BackendEntry[];
};

export type ChartSeries = {
  name: string;
  data: number[];
};

export const useSensorHistory = (id?: number) => {
  const queryClient = useQueryClient();

  const apiClient = new APIClient<BackendComponentData[]>(
    "rooms/get/all/components/chunk/values"
  );

  const getSensorHistory = useQuery<ChartSeries[], Error>({
    queryKey: ["SENSOR_HISTORY"],
    queryFn: async () => {
      const rawData = await apiClient.getAllById(id!);
      const flatData = rawData.flat();
      return transformSensorData(flatData);
    },
    enabled: typeof id === "number",
  });

  return {
    getSensorHistory,
    refetch: () =>
      queryClient.invalidateQueries({ queryKey: ["SENSOR_HISTORY"] }),
  };
};
