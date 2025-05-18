import type { Theme, SxProps, Breakpoint } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import { useTheme } from "@mui/material/styles";

import { Main } from "./main";
import { layoutClasses } from "../classes";
import { LayoutSection } from "../core/core-layout";
import { HeaderSection } from "../core/header-section";
import { AccountPopover } from "../component/account-popover";

// ----------------------------------------------------------------------

export type DashboardLayoutProps = {
  sx?: SxProps<Theme>;
  children: React.ReactNode;
  header?: {
    sx?: SxProps<Theme>;
  };
};

export function DashboardLayout({
  sx,
  children,
  header,
}: DashboardLayoutProps) {
  const theme = useTheme();

  const layoutQuery: Breakpoint = "lg";

  return (
    <LayoutSection
      /** **************************************
       * Header
       *************************************** */
      headerSection={
        <HeaderSection
          layoutQuery={layoutQuery}
          slotProps={{
            container: {
              maxWidth: false,
              sx: { px: { [layoutQuery]: 5 } },
            },
          }}
          sx={header?.sx}
          slots={{
            topArea: (
              <Alert severity="info" sx={{ display: "none", borderRadius: 0 }}>
                This is an info Alert.
              </Alert>
            ),
            leftArea: <></>,
            rightArea: (
              <Box gap={1} display="flex" alignItems="center">
                {/* <Searchbar /> */}
                {/* <LanguagePopover data={_langs} /> */}
                {/* <NotificationsPopover data={_notifications} /> */}
                <AccountPopover
                  data={[
                    {
                      label: "Dashboard",
                      href: "/",
                    },
                    {
                      label: "Settings",
                      href: "/settings",
                    },
                  ]}
                />
              </Box>
            ),
          }}
        />
      }
      /** **************************************
       * Sidebar
       *************************************** */

      // sidebarSection={
      //   <NavDesktop
      //     data={navData}
      //     layoutQuery={layoutQuery}
      //     workspaces={null}
      //   />
      // }
      /** **************************************
       * Footer
       *************************************** */
      footerSection={null}
      /** **************************************
       * Style
       *************************************** */
      cssVars={{
        "--layout-nav-vertical-width": "300px",
        "--layout-dashboard-content-pt": theme.spacing(1),
        "--layout-dashboard-content-pb": theme.spacing(8),
        "--layout-dashboard-content-px": theme.spacing(5),
      }}
      sx={{
        [`& .${layoutClasses.hasSidebar}`]: {
          [theme.breakpoints.up(layoutQuery)]: {
            pl: "var(--layout-nav-vertical-width)",
          },
        },
        ...sx,
      }}
    >
      <Main>{children}</Main>
    </LayoutSection>
  );
}
