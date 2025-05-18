import { useState, useRef } from "react";
import { Card, Switch, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CircularSlider from "@fseehawer/react-circular-slider";

interface LedSliderViewProps {
  curtain: {
    active: boolean;
    value: string;
  };
  checkButtonClick: () => void;
  curtainPercentage: number | string;
  setCurtainPercentage: (value: number | string) => void;
}

export function CurtainSliderView({
  curtain,
  checkButtonClick,
  curtainPercentage,
  setCurtainPercentage,
}: LedSliderViewProps) {
  const theme = useTheme();
  const [tempValue, setTempValue] = useState<number | string>(
    curtainPercentage
  );
  const sliderRef = useRef<HTMLDivElement>(null);

  const handlePointerUp = () => {
    setCurtainPercentage(tempValue);
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
          Curtain Control
        </Typography>
        <Switch
          color="warning"
          onClick={checkButtonClick}
          checked={curtain.active}
        />
      </Box>
      <Box
        ref={sliderRef}
        onPointerUp={handlePointerUp}
        onMouseUp={handlePointerUp} // fallback
        onTouchEnd={handlePointerUp} // fallback
      >
        <CircularSlider
          label="Curtain %"
          labelColor={theme.palette.common.black}
          knobColor={theme.palette.warning.darker}
          progressColorFrom={theme.palette.warning.light}
          progressColorTo={theme.palette.warning.dark}
          progressSize={16}
          trackColor={theme.palette.grey[200]}
          trackSize={20}
          dataIndex={+curtainPercentage - 1}
          width={250}
          data={Array.from({ length: 100 }, (_, i) => i + 1)}
          onChange={(value) => setTempValue(value)}
        />
      </Box>
    </Card>
  );
}
