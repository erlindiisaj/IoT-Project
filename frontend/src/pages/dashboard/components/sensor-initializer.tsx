import { useEffect } from "react";
import { useComponents } from "src/hooks/useComponents";
import { useSensorsStore } from "@store/sensors";
import type { SensorsStore } from "@store/sensors";

interface Props {
  roomId: number;
}

export const SensorInitializer = ({ roomId }: Props) => {
  const { getAllComponents } = useComponents(roomId);
  const { data: allComponents } = getAllComponents;
  const setSensors = useSensorsStore((s) => s.setSensors);
  const setLoading = useSensorsStore((s) => s.setLoading);

  useEffect(() => {
    if (!allComponents) return;

    // Create object with keys matching your store's fixed shape
    const parsedSensors = allComponents.reduce((acc, { component, value }) => {
      const { id, type, pin, room } = component;

      // Only assign if type exists in your defined keys
      if (
        ["led", "pir", "motor", "dht", "ldr", "dht_humidity"].includes(type)
      ) {
        acc[type as keyof typeof acc] = {
          id,
          type,
          pin,
          room,
          value,
        };
      }

      return acc;
    }, {} as Partial<SensorsStore["sensors"]>);

    setSensors(parsedSensors);
    setLoading(false);
  }, [allComponents, roomId, setLoading, setSensors]);

  return null;
};
