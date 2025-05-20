type BackendEntry = {
  id: number;
  action: string;
  mode: string;
  timestamp: string;
  previous_value: number;
  current_value: number;
  component: number;
};

type BackendComponentData = {
  component_name: string;
  data: BackendEntry[];
};

type ChartSeries = {
  name: string;
  data: number[];
};

// Transform backend data into ApexChart series
export function transformSensorData(
  rawData: BackendComponentData[]
): ChartSeries[] {
  // Map backend component names to display names (only those you want)
  const nameMap: Record<string, string> = {
    dht: "Temperature (°C)",
    pir: "Motion Events",
    motor: "LED Brightness (%)",
  };

  return rawData
    .filter((component) =>
      Object.keys(nameMap).includes(component.component_name)
    ) // filter
    .map((component) => {
      const name = nameMap[component.component_name];

      // Sort data by timestamp ascending
      const sortedData = [...component.data].sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      const data = sortedData.map((entry) => entry.current_value);
      return { name, data };
    });
}
