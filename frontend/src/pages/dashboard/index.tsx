import SessionsChart from "@components/chart/chart";
import { Grid, Box, Typography } from "@mui/material";
import RoomDropdown from "./components/room-dropdown";
import { WeatherCard } from "./components/weather-card";
import { MainContentContainer } from "src/layouts/dashboard/main";
import { useWebSocketSensorSync } from "src/hooks/useWebSocket";
import { useRoom } from "src/hooks/useRoom";
import { useSensorsStore } from "@store/sensors";

import { SensorsControlCenter } from "./components/sensors-control-center";
import { SensorInitializer } from "./components/sensor-initializer";

export function Dashboard() {
  const { getRooms } = useRoom();
  const { data: rooms } = getRooms;
  console.log("Rooms: ", rooms);
  const { room } = useSensorsStore();

  useWebSocketSensorSync();

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
                display: "flex",
                justifyContent: "flex-end",
                marginTop: 3,
              }}
            >
              <RoomDropdown rooms={rooms} />
            </Box>
            {room ? (
              <>
                <SensorInitializer roomId={room.id} />
                <SensorsControlCenter />
              </>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 3,
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  Please select a room to view the sensors.
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <SessionsChart />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}></Grid>
      </Grid>
    </MainContentContainer>
  );
}
