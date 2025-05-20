import { Grid, Box, Typography, Card } from "@mui/material";
import RoomDropdown from "./components/room-dropdown";
import { WeatherCard } from "./components/weather-card";
import { MainContentContainer } from "src/layouts/dashboard/main";
import { useWebSocketSensorSync } from "src/hooks/useWebSocket";
import { useRoom } from "src/hooks/useRoom";
import { useSensorsStore } from "@store/sensors";

import { SensorsControlCenter } from "./components/sensors-control-center";
import { SensorInitializer } from "./components/sensor-initializer";
import { useWeather } from "src/hooks/useWeather";
import SensorChart from "@components/chart/chart";
import { useSensorHistory } from "src/hooks/useSensorHistory";

export function Dashboard() {
  const { getRooms } = useRoom();
  const { data: rooms } = getRooms;
  const { room } = useSensorsStore();

  const { getWeather } = useWeather();
  const { data: weather, isLoading } = getWeather;

  const { getSensorHistory } = useSensorHistory(room?.id);
  const { data: chartData } = getSensorHistory;

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
            <WeatherCard data={weather} isLoading={isLoading} />
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
          {room ? (
            <SensorChart data={chartData} />
          ) : (
            <Card
              sx={{
                padding: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="body2">
                Waiting for room selection to show sensor data.
              </Typography>
            </Card>
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}></Grid>
      </Grid>
    </MainContentContainer>
  );
}
