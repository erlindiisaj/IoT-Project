import ReactApexChart from "react-apexcharts";
import { Card, CardContent, Typography, useTheme, Box } from "@mui/material";

const SensorChart = () => {
  const theme = useTheme();

  // Labels like the second component's days in April 2024 (showing just first 30 days)
  const labels = [
    "Apr 1",
    "Apr 2",
    "Apr 3",
    "Apr 4",
    "Apr 5",
    "Apr 6",
    "Apr 7",
    "Apr 8",
    "Apr 9",
    "Apr 10",
    "Apr 11",
    "Apr 12",
    "Apr 13",
    "Apr 14",
    "Apr 15",
    "Apr 16",
    "Apr 17",
    "Apr 18",
    "Apr 19",
    "Apr 20",
    "Apr 21",
    "Apr 22",
    "Apr 23",
    "Apr 24",
    "Apr 25",
    "Apr 26",
    "Apr 27",
    "Apr 28",
    "Apr 29",
    "Apr 30",
  ];

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "area",
      height: 350,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    colors: [
      theme.palette.info.light, // Temperature
      theme.palette.warning.main, // LED brightness
      theme.palette.error.main, // Motion
    ],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0.5,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 100],
      },
    },
    xaxis: {
      categories: labels,
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
        rotate: -45,
        hideOverlappingLabels: true,
        showDuplicates: false,
      },
      tickAmount: 4,
      axisBorder: {
        show: false,
        color: theme.palette.divider,
      },
      axisTicks: {
        show: false,
        color: theme.palette.divider,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    grid: {
      borderColor: theme.palette.divider,
      row: {
        colors: ["transparent", "transparent"], // no striped background
      },
    },
    legend: {
      position: "bottom",
      labels: {
        colors: theme.palette.text.primary,
      },
    },
  };

  const series = [
    {
      name: "Temperature (°C)",
      data: [
        21, 22, 23, 22, 24, 23, 25, 26, 24, 23, 22, 21, 22, 23, 24, 25, 25, 24,
        23, 22, 21, 21, 22, 23, 24, 24, 25, 26, 26, 27,
      ],
    },
    {
      name: "LED Brightness (%)",
      data: [
        0, 20, 40, 60, 80, 100, 100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0, 20,
        40, 60, 80, 100, 80, 60, 40, 20, 0, 10, 30, 50,
      ],
    },
    {
      name: "Motion Events",
      data: [
        5, 10, 8, 12, 15, 20, 18, 17, 14, 13, 12, 11, 10, 9, 8, 12, 15, 16, 18,
        20, 25, 22, 20, 18, 17, 15, 13, 11, 9, 7,
      ],
    },
  ];

  return (
    <Card>
      <CardContent>
        <Box mb={2}>
          <Typography variant="h6" gutterBottom>
            Sensor Activity Overview - Last 30 Days
          </Typography>
          <Typography variant="caption" color="textSecondary" gutterBottom>
            Temperature, LED brightness & motion events per day
          </Typography>
        </Box>
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          height={350}
        />
      </CardContent>
    </Card>
  );
};

export default SensorChart;
