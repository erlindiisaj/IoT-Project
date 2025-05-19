import { useState } from "react";
import { SvgColor } from "@components/svg-color";
import SessionsChart from "@components/chart/chart";
import { Grid, Box, Typography } from "@mui/material";
import RoomDropdown from "./components/room-dropdown";
import { WeatherCard } from "./components/weather-card";
import { SensorWidget } from "./components/sensor-widget";
import { LedSliderView } from "./components/led-slider-view";
import { MainContentContainer } from "src/layouts/dashboard/main";
import { CurtainSliderView } from "./components/curtain-slider-view";
import { useWebSocketWithReactQuery } from "src/hooks/useWebSocket";
import { useRoom } from "src/hooks/useRoom";
import { useSensorsStore } from "@store/sensors";
import { useComponents } from "src/hooks/useComponents";

const initialLedState = {
  active: false,
  value: "Off",
};

const initialMotionState = {
  active: false,
  value: "No Motion",
};

const initialCurtainState = {
  active: false,
  value: "Closed",
};

const initialModeState = {
  active: false,
  value: "Manual",
};

export function Dashboard() {
  const [led, setLed] = useState(initialLedState);
  const [motion, setMotion] = useState(initialMotionState);
  const [curtain, setCurtain] = useState(initialCurtainState);
  const [mode, setMode] = useState(initialModeState);
  const [ledPercentage, setLedPercentage] = useState<string | number>(0);
  const [curtainPercentage, setCurtainPercentage] = useState<string | number>(
    0
  );

  const [currentSliderView, setCurrentSliderView] = useState("led");

  const { getRooms } = useRoom();
  const { data: rooms } = getRooms;

  const { room } = useSensorsStore();
  console.log("Room: ", room);
  const { getComponents, getAllComponents } = useComponents(7);
  const { data: components } = getComponents;
  const { data: allComponents } = getAllComponents;
  console.log("All Components: ", allComponents);
  console.log("Components: ", components);

  const socketData = useWebSocketWithReactQuery(["queryKey"]);
  console.log("Socket Data: ", socketData);

  const handleLedClick = () => {
    setLed((prev) => ({
      ...prev,
      active: !prev.active,
      value: prev.active ? "Off" : "On",
    }));
    console.log("LED clicked");
  };

  const handleMotionClick = () => {
    setMotion((prev) => ({
      ...prev,
      active: !prev.active,
      value: prev.active ? "No Motion" : "Motion Detected",
    }));
    console.log("Motion sensor clicked");
  };

  const handleCurtainClick = () => {
    setCurtain((prev) => ({
      ...prev,
      active: !prev.active,
      value: prev.active ? "Closed" : "Open",
    }));
    console.log("Curtain motor clicked");
  };

  const handleModeClick = () => {
    setMode((prev) => ({
      ...prev,
      active: !prev.active,
      value: prev.active ? "Manual" : "Auto",
    }));
    console.log("Mode clicked");
  };

  const handleChangeLedViewer = () => {
    setCurrentSliderView("led");
  };

  const handleChangeCurtainViewer = () => {
    setCurrentSliderView("curtain");
  };

  return (
    <MainContentContainer maxWidth="lg">
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <WeatherCard />
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
                    50%
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
                    85C
                  </Typography>
                </Box>
                <RoomDropdown rooms={rooms} />
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginTop: 3,
                gap: 3,
              }}
            >
              <SensorWidget
                icon={{
                  active: "/assets/bulb-on.svg",
                  inactive: "/assets/bulb-off.svg",
                }}
                title="Led Light"
                active={led.active}
                value={led.value}
                color="error"
                onClick={handleLedClick}
                changeViewer={handleChangeLedViewer}
                checkButton
              />
              <SensorWidget
                icon={{
                  active: "/assets/motion.svg",
                }}
                title="Motion Sensor"
                active={motion.active}
                value={motion.value}
                color="info"
                onClick={handleMotionClick}
              />
              <SensorWidget
                icon={{
                  active: "/assets/curtain.svg",
                }}
                title="Curtain Motor"
                active={curtain.active}
                value={curtain.value}
                color="warning"
                onClick={handleCurtainClick}
                changeViewer={handleChangeCurtainViewer}
                checkButton
              />
              <SensorWidget
                icon={{
                  active: "/assets/auto-mode.svg",
                  inactive: "/assets/manual-mode.svg",
                }}
                title="Mode"
                active={mode.active}
                value={mode.value}
                color="primary"
                onClick={handleModeClick}
                checkButton
              />
            </Box>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <SessionsChart />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          {currentSliderView === "led" ? (
            <LedSliderView
              led={led}
              checkButtonClick={handleLedClick}
              ledPercentage={ledPercentage}
              setLedPercentage={setLedPercentage}
            />
          ) : (
            <CurtainSliderView
              curtain={curtain}
              checkButtonClick={handleCurtainClick}
              curtainPercentage={curtainPercentage}
              setCurtainPercentage={setCurtainPercentage}
            />
          )}
        </Grid>
      </Grid>
    </MainContentContainer>
  );
}
