import { useEffect, useRef } from "react";
import { WEBSOCKET_URL } from "src/config-global";
import { useSensorsStore } from "@store/sensors";

interface componentData {
  action: string;
  component: number;
  current_value: number;
  id: number;
  mode: string;
  previous_value: number;
  timestamp: string;
}
interface webSocketData {
  type: string;
  data: componentData;
}
export function useWebSocketSensorSync() {
  const ws = useRef<WebSocket | null>(null);
  const setSensors = useSensorsStore((state) => state.setSensors);
  const sensors = useSensorsStore((state) => state.sensors);

  useEffect(() => {
    ws.current = new WebSocket(WEBSOCKET_URL);

    ws.current.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.current.onmessage = (event: MessageEvent) => {
      try {
        const data: webSocketData = JSON.parse(event.data);
        console.log("WebSocket message received:", data);

        if (data.type === "component_data") {
          const sensorId = data.data.component;
          const value = data.data.current_value;

          console.log("Sensor ID:", sensorId);
          console.log("Sensor Value:", value);

          // Find which sensor in Zustand matches this component ID
          const sensorKey = Object.keys(sensors).find(
            (key) => sensors[key as keyof typeof sensors].id === sensorId
          ) as keyof typeof sensors | undefined;

          if (sensorKey) {
            // Update Zustand store
            setSensors({
              [sensorKey]: {
                ...sensors[sensorKey],
                value: value,
              },
            });
          }
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.current?.close();
    };
  }, [setSensors, sensors]);
}
