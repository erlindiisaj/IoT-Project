import { SvgColor } from "@components/svg-color";
import { Card, Box, Switch, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface SensorWidgetProps {
  icon: Icons;
  title: string;
  value: string;
  color?: string;
  active?: boolean;
  onClick: () => void;
  changeViewer?: () => void;
  checkButton?: boolean;
}

interface Icons {
  active: string;
  inactive?: string;
}

export function SensorWidget({
  icon,
  title,
  value,
  color,
  active = false,
  checkButton = false,
  changeViewer,
  onClick,
}: SensorWidgetProps) {
  const theme = useTheme();

  const shadow = {
    error: theme.customShadows.error,
    primary: theme.customShadows.primary,
    secondary: theme.customShadows.secondary,
    success: theme.customShadows.success,
    warning: theme.customShadows.warning,
    info: theme.customShadows.info,
  };

  const mainColor = {
    error: theme.palette.error.main,
    primary: theme.palette.primary.main,
    secondary: theme.palette.secondary.main,
    success: theme.palette.success.main,
    warning: theme.palette.warning.main,
    info: theme.palette.info.main,
  };

  return (
    <Card
      sx={{
        width: "100%",
        padding: 2,
        backgroundColor: active ? mainColor[color as keyof typeof color] : "",
        boxShadow: active
          ? shadow[color as keyof typeof shadow]
          : theme.customShadows.card,

        cursor: changeViewer ? "pointer" : "default",
      }}
      onClick={changeViewer}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          minHeight: 40,
        }}
      >
        <Typography color={active ? "white" : ""} variant="subtitle2">
          {value}
        </Typography>
        {checkButton && (
          <Switch
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            color="default"
            checked={active}
          />
        )}
      </Box>
      {active && (
        <SvgColor
          src={icon.active}
          sx={{
            width: 40,
            height: 40,
            marginBottom: 2,
            color: theme.palette.common.white,
          }}
        />
      )}
      {!active && (
        <SvgColor
          src={icon.inactive ?? icon.active}
          sx={{
            width: 40,
            height: 40,
            marginBottom: 2,
            color: theme.palette.grey[500],
          }}
        />
      )}

      <Typography color={active ? "white" : ""}>{title}</Typography>
    </Card>
  );
}
