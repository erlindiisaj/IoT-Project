import type { Theme } from "@mui/material/styles";

import { createTheme as createMuiTheme } from "@mui/material/styles";

import { shadows } from "./core/shadows";
import { palette } from "./core/palette";
import { themeConfig } from "./theme-config";
import { components } from "./core/components";
import { typography } from "./core/typography";
import { customShadows } from "./core/custom-shadows";

import type { ThemeOptions } from "./types";

// ----------------------------------------------------------------------

export const baseTheme: ThemeOptions = {
  colorSchemes: {
    light: {
      palette: palette.light,
      shadows: shadows.light,
      customShadows: customShadows.light,
    },
  },
  components,
  typography,
  shape: { borderRadius: 8 },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1350,
      xl: 1536,
    },
  },
  cssVariables: themeConfig.cssVariables,
};

// ----------------------------------------------------------------------

type CreateThemeProps = {
  themeOverrides?: ThemeOptions;
};

export function createTheme({
  themeOverrides = {},
}: CreateThemeProps = {}): Theme {
  const theme = createMuiTheme(baseTheme, themeOverrides);

  return theme;
}
