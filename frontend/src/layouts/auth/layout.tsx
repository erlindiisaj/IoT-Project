import type { Theme, SxProps, Breakpoint } from "@mui/material/styles";

import { stylesMode } from "../../theme/styles";

import { Main } from "./main";
import { LayoutSection } from "../core/core-layout";

// ----------------------------------------------------------------------

export type AuthLayoutProps = {
  sx?: SxProps<Theme>;
  children: React.ReactNode;
  header?: {
    sx?: SxProps<Theme>;
  };
};

export function AuthLayout({ sx, children }: AuthLayoutProps) {
  const layoutQuery: Breakpoint = "md";

  return (
    <LayoutSection
      headerSection={null}
      footerSection={null}
      cssVars={{ "--layout-auth-content-width": "420px" }}
      sx={{
        "&::before": {
          width: 1,
          height: 1,
          zIndex: -1,
          content: "''",
          opacity: 0.24,
          position: "fixed",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          backgroundImage: `url(/assets/background/overlay.jpg)`,
          [stylesMode.dark]: { opacity: 0.08 },
        },
        ...sx,
      }}
    >
      <Main layoutQuery={layoutQuery}>{children}</Main>
    </LayoutSection>
  );
}
