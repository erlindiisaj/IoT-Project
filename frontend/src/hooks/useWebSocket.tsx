import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { WEBSOCKET_URL } from "src/config-global";

interface SensorReading {
  sensorId: number;
  temperature: number;
  humidity: number;
  timestamp: string;
}

export function useWebSocketWithReactQuery(queryKey: readonly unknown[]) {
  const ws = useRef<WebSocket | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    ws.current = new WebSocket(WEBSOCKET_URL);

    ws.current.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.current.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);

        // Normalize data to an array of SensorReading objects
        const newReadings: SensorReading[] = Array.isArray(data)
          ? data
          : [data];

        queryClient.setQueryData<SensorReading[]>(queryKey, (oldData) => {
          if (!oldData) return newReadings;

          // Create a copy to avoid mutating oldData directly
          const updated = [...oldData];

          newReadings.forEach((newReading) => {
            const idx = updated.findIndex(
              (r) => r.sensorId === newReading.sensorId
            );
            if (idx !== -1) {
              updated[idx] = newReading; // Replace existing reading
            } else {
              updated.push(newReading); // Add new sensor reading
            }
          });

          return updated;
        });
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
  }, [queryClient, queryKey]);
}
