import type { Theme, SxProps, CSSObject } from "@mui/material/styles";

import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import GlobalStyles from "@mui/material/GlobalStyles";

import { baseVars } from "../config-vars";
import { layoutClasses } from "../classes";

// ----------------------------------------------------------------------

export type LayoutSectionProps = {
  sx?: SxProps<Theme>;
  cssVars?: CSSObject;
  children?: React.ReactNode;
  footerSection?: React.ReactNode;
  headerSection?: React.ReactNode;
  sidebarSection?: React.ReactNode;
};

export function LayoutSection({
  sx,
  cssVars,
  children,
  footerSection,
  headerSection,
}: LayoutSectionProps) {
  const theme = useTheme();

  const inputGlobalStyles = (
    <GlobalStyles
      styles={{
        body: {
          ...baseVars(theme),
          ...cssVars,
        },
      }}
    />
  );

  return (
    <>
      {inputGlobalStyles}

      <Box id="root__layout" className={layoutClasses.root} sx={sx}>
        <Box display="flex" flex="1 1 auto" flexDirection="column">
          {headerSection}
          {children}
          {footerSection}
        </Box>
      </Box>
    </>
  );
}
