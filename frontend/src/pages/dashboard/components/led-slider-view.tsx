import { useState, useEffect } from "react";
import { Card, Switch, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CircularSlider from "@fseehawer/react-circular-slider";

import type { Sensor } from "@store/sensors";
import type { updateComponentValue } from "@interfaces/IComponents";

interface LedSliderViewProps {
  led: Sensor;
  checkButtonClick: (payload: updateComponentValue) => void;
}

export function LedSliderView({ led, checkButtonClick }: LedSliderViewProps) {
  const theme = useTheme();
  const [tempValue, setTempValue] = useState<number>(Number(led.value));
  const [isInteracting, setIsInteracting] = useState(false);

  // Sync temp value from live led value unless user is currently interacting
  useEffect(() => {
    if (!isInteracting) {
      setTempValue(Number(led.value));
    }
  }, [led.value, isInteracting]);

  // Handle pointer/touch/mouse release globally to catch all cases
  useEffect(() => {
    const handleGlobalPointerUp = () => {
      if (isInteracting) {
        setIsInteracting(false);
        checkButtonClick({
          id: led.id,
          value: tempValue,
        });
      }
    };

    window.addEventListener("mouseup", handleGlobalPointerUp);
    window.addEventListener("touchend", handleGlobalPointerUp);
    window.addEventListener("pointerup", handleGlobalPointerUp);

    return () => {
      window.removeEventListener("mouseup", handleGlobalPointerUp);
      window.removeEventListener("touchend", handleGlobalPointerUp);
      window.removeEventListener("pointerup", handleGlobalPointerUp);
    };
  }, [isInteracting, tempValue, led.id, checkButtonClick]);

  const data = Array.from({ length: 100 }, (_, i) => i + 1);

  return (
    <Card
      sx={{
        padding: 3,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 3,
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          Led Control
        </Typography>
        <Switch
          color="error"
          onClick={(e) => {
            e.stopPropagation();
            checkButtonClick({
              id: led.id,
              value: Number(led.value) > 0 ? 0 : tempValue,
            });
          }}
          checked={Number(led.value) > 0}
        />
      </Box>

      <Box
        onPointerDown={() => setIsInteracting(true)}
        onTouchStart={() => setIsInteracting(true)}
        onMouseDown={() => setIsInteracting(true)}
      >
        <CircularSlider
          label="Led %"
          data={data}
          dataIndex={tempValue}
          onChange={(value) => setTempValue(value as number)}
          labelColor={theme.palette.common.black}
          knobColor={theme.palette.error.darker}
          progressColorFrom={theme.palette.error.light}
          progressColorTo={theme.palette.error.dark}
          progressSize={16}
          trackColor={theme.palette.grey[200]}
          trackSize={20}
          width={250}
        />
      </Box>

      <Typography variant="h6" sx={{ mt: 2 }}>
        Brightness: {tempValue}%
      </Typography>
    </Card>
  );
}
