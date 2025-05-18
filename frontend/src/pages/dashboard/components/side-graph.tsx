import SessionsChart from "@components/chart/chart";
import { Card, Typography } from "@mui/material";

export function SideGraph() {
  return (
    <Card
      sx={{
        padding: 3,
      }}
    >
      <Typography variant="h4">Side Graph</Typography>
      <Typography variant="body2">This is a simple side graph card.</Typography>
      <SessionsChart />
    </Card>
  );
}
