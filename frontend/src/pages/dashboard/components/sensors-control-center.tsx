import { useState } from "react";
import { SvgColor } from "@components/svg-color";
import { Box, Typography } from "@mui/material";
import { SensorWidget } from "./sensor-widget";
import { LedSliderView } from "./led-slider-view";
import { CurtainSliderView } from "./curtain-slider-view";

import { CircularProgress } from "@mui/material";
import type { updateRoomDTO } from "@interfaces/IRoom";
import { useRoom } from "src/hooks/useRoom";
import { useComponents } from "src/hooks/useComponents";
import { useSensorsStore } from "@store/sensors";
import type { updateComponentValue } from "@interfaces/IComponents";
import { ModeWidget } from "./mode-widget";

export function SensorsControlCenter() {
  const [currentSliderView, setCurrentSliderView] = useState("led");

  const { room, sensors, loading, setSensors, setRoom } = useSensorsStore();

  const { led, pir, motor, dht, dht_humidity } = sensors;

  const { updateComponentValue } = useComponents(room?.id);

  const { updateRoom } = useRoom();

  const handleLedClick = (payload: updateComponentValue) => {
    setSensors({
      led: {
        ...sensors.led,
        value: payload.value,
      },
    });

    updateComponentValue.mutate(payload);
  };

  const handleMotionClick = (payload: updateComponentValue) => {
    setSensors({
      motor: {
        ...sensors.motor,
        value: payload.value,
      },
    });

    updateComponentValue.mutate(payload);
  };

  const handleCurtainClick = (payload: updateComponentValue) => {
    setSensors({
      motor: {
        ...sensors.motor,
        value: payload.value,
      },
    });

    updateComponentValue.mutate(payload);
  };

  const handleModeClick = (payload: updateRoomDTO) => {
    if (!room) return;

    setRoom({
      ...room,
      mode: payload.mode,
    });

    updateRoom.mutate(payload);
  };

  const handleChangeLedViewer = () => {
    setCurrentSliderView("led");
  };

  const handleChangeCurtainViewer = () => {
    setCurrentSliderView("curtain");
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "100%",
          marginTop: 3,
        }}
      >
        <Typography variant="h5">Erlindi Isaj's Home</Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SvgColor
              sx={{
                color: "primary.main",
              }}
              src="/assets/humidity.svg"
            />
            <Typography color="primary.dark" variant="body2">
              {dht_humidity.value}%
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SvgColor
              sx={{
                color: "error.main",
              }}
              src="/assets/temp.svg"
            />
            <Typography color="error.dark" variant="body2">
              {dht.value}°C
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginY: 3,
          gap: 3,
        }}
      >
        <SensorWidget
          icon={{
            active: "/assets/bulb-on.svg",
            inactive: "/assets/bulb-off.svg",
          }}
          title="Led Light"
          active={Number(led.value) > 0 ? true : false}
          value={Number(led.value) > 0 ? "On" : "Off"}
          color="error"
          onClick={handleLedClick}
          changeViewer={handleChangeLedViewer}
          checkButton
          sensor={led}
          disabled={Number(room?.mode) === 0 ? false : true}
        />
        <SensorWidget
          icon={{
            active: "/assets/motion.svg",
          }}
          title="Motion Sensor"
          active={Number(pir.value) === 0 ? false : true}
          value={Number(pir.value) === 0 ? "No Motion" : "Motion Detected"}
          color="info"
          onClick={handleMotionClick}
          sensor={pir}
        />
        <SensorWidget
          icon={{
            active: "/assets/curtain.svg",
          }}
          title="Curtain Motor"
          active={Number(motor.value) > 0 ? false : true}
          value={
            Number(motor.value) === 100
              ? "Closed"
              : Number(motor.value) === 0
              ? "Open"
              : "Toggle"
          }
          color="warning"
          onClick={handleCurtainClick}
          changeViewer={handleChangeCurtainViewer}
          checkButton
          sensor={motor}
          disabled={Number(room?.mode) === 0 ? false : true}
        />
        {room && (
          <ModeWidget
            icon={{
              active: "/assets/auto-mode.svg",
              inactive: "/assets/manual-mode.svg",
            }}
            title="Mode"
            active={Number(room.mode) === 0 ? false : true}
            value={Number(room.mode) === 0 ? "Manual" : "Auto"}
            color="primary"
            modeChange={handleModeClick}
            checkButton
            room={room}
          />
        )}
      </Box>
      {currentSliderView === "led" ? (
        <LedSliderView
          disabled={Number(room?.mode) === 0 ? false : true}
          led={led}
          checkButtonClick={handleLedClick}
        />
      ) : (
        <CurtainSliderView
          disabled={Number(room?.mode) === 0 ? false : true}
          curtain={motor}
          checkButtonClick={handleMotionClick}
        />
      )}
    </>
  );
}
