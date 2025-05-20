import { SvgColor } from "@components/svg-color";
import { Card, CardMedia, Typography, Box } from "@mui/material";
import { useAuthStore } from "@store/authStore";
import type { WeatherData } from "src/hooks/useWeather";

interface WeatherCardProps {
  data?: WeatherData;
  isLoading: boolean;
}

export function WeatherCard({ data, isLoading }: WeatherCardProps) {
  const { user } = useAuthStore();
  return (
    <Card
      sx={{
        display: "flex",
        padding: 3,
        alignItems: "flex-start",
        justifyContent: "space-between",
      }}
    >
      {/* 2. Then your content in CardContent */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: 300,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Hello, {user?.displayName}!
          </Typography>
          <Typography variant="body2" gutterBottom>
            Welcome to your smart home control panel.
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            marginTop: 2,
          }}
        >
          <SvgColor src="/assets/temp.svg" />
          <Typography variant="h6" sx={{ marginLeft: 2 }}>
            {isLoading ? "Loading... " : `${data?.current.temp_c}°C `}
            Outdoor Temperature
          </Typography>
        </Box>
      </Box>

      {/* 1. Use CardMedia for a fully responsive image */}
      <CardMedia
        component="img"
        image="/assets/smart-home-control.png"
        alt="Smart Home Control Illustration"
        sx={{
          maxHeight: 300,
          width: 400,
          objectFit: "contain",
          marginRight: 4,
        }}
      />
    </Card>
  );
}
