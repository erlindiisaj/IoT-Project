import { useState, useRef } from "react";
import { Card, Switch, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CircularSlider from "@fseehawer/react-circular-slider";

interface LedSliderViewProps {
  led: {
    active: boolean;
    value: string;
  };
  checkButtonClick: () => void;
  ledPercentage: number | string;
  setLedPercentage: (value: number | string) => void;
}

export function LedSliderView({
  led,
  checkButtonClick,
  ledPercentage,
  setLedPercentage,
}: LedSliderViewProps) {
  const theme = useTheme();
  const [tempValue, setTempValue] = useState<number | string>(ledPercentage);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handlePointerUp = () => {
    setLedPercentage(tempValue);
  };

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
        <Switch color="error" onClick={checkButtonClick} checked={led.active} />
      </Box>
      <Box
        ref={sliderRef}
        onPointerUp={handlePointerUp}
        onMouseUp={handlePointerUp}
        onTouchEnd={handlePointerUp}
      >
        <CircularSlider
          label="Led %"
          labelColor={theme.palette.common.black}
          knobColor={theme.palette.error.darker}
          progressColorFrom={theme.palette.error.light}
          progressColorTo={theme.palette.error.dark}
          progressSize={16}
          trackColor={theme.palette.grey[200]}
          trackSize={20}
          dataIndex={+ledPercentage - 1}
          width={250}
          data={Array.from({ length: 100 }, (_, i) => i + 1)}
          onChange={(value) => setTempValue(value)}
        />
      </Box>
    </Card>
  );
}
