import type { Theme, Components } from "@mui/material/styles";
import { SvgColor } from "@components/svg-color";

import { varAlpha } from "../styles/utils";

const MuiButton: Components<Theme>["MuiButton"] = {
  defaultProps: {
    disableElevation: true,
  },
  styleOverrides: {
    containedInherit: ({ theme }) => ({
      fontWeight: 500,
      color: theme.vars.palette.common.white,
      backgroundColor: theme.vars.palette.grey[800],
      "&:hover": {
        color: theme.vars.palette.common.white,
        backgroundColor: theme.vars.palette.grey[800],
      },
    }),

    sizeLarge: {
      minHeight: 42,
    },
  },
};

const MuiOutlinedInput: Components<Theme>["MuiOutlinedInput"] = {
  styleOverrides: {
    root: ({ theme, ownerState }) => ({
      height: 54,
      "& input:-webkit-autofill": {
        WebkitBoxShadow: `0 0 0px 1000px ${theme.palette.background.neutral} inset`,
        WebkitTextFillColor: theme.palette.text.primary,
        transition: "background-color 5000s ease-in-out 0s",
      },
      ...(ownerState.size === "small" && {
        padding: theme.spacing(1),
        height: 40,
      }),
    }),

    input: ({ theme, ownerState }) => ({
      ...(ownerState.size === "small" && {
        padding: theme.spacing(1),
        fontSize: theme.typography.pxToRem(14),
      }),
    }),

    notchedOutline: ({ theme }) => ({
      borderColor: varAlpha(theme.palette.grey["500Channel"], 0.24),
      color: theme.palette.text.primary,
    }),
  },
};

const MuiInputLabel: Components<Theme>["MuiInputLabel"] = {
  styleOverrides: {
    root: ({ theme }) => ({
      color: theme.palette.text.disabled,
      fontWeight: 500,
    }),
  },
};

const MuiCard: Components<Theme>["MuiCard"] = {
  styleOverrides: {
    root: ({ theme }) => ({
      zIndex: 0,
      position: "relative",
      boxShadow: theme.customShadows.card,
      borderRadius: theme.shape.borderRadius * 2,
    }),
  },
};

const MuiTableCell: Components<Theme>["MuiTableCell"] = {
  styleOverrides: {
    head: ({ theme }) => ({
      fontSize: theme.typography.pxToRem(14),
      color: theme.vars.palette.text.secondary,
      fontWeight: theme.typography.fontWeightSemiBold,
      backgroundColor: theme.vars.palette.background.neutral,
    }),
  },
};

const MuiAvatar: Components<Theme>["MuiAvatar"] = {
  styleOverrides: {
    square: ({ theme }) => ({
      borderRadius: theme.shape.borderRadius,
    }),
  },
};

const MuiCardHeader: Components<Theme>["MuiCardHeader"] = {
  defaultProps: {
    titleTypographyProps: { variant: "h6" },
    subheaderTypographyProps: { variant: "body2" },
  },
  styleOverrides: {
    root: ({ theme }) => ({
      padding: theme.spacing(3, 3, 3),
    }),
  },
};

const MuiMenuItem: Components<Theme>["MuiMenuItem"] = {
  styleOverrides: {
    root: ({ theme }) => ({
      borderRadius: "6px",
      padding: "0 12px",
      height: "34px",
      margin: "6px",
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
      "&.Mui-selected": {
        backgroundColor: theme.palette.grey[300],
      },
      "&.Mui-selected:hover": {
        backgroundColor: theme.palette.grey[200],
      },
    }),
  },
};

const MuiCheckbox: Components<Theme>["MuiCheckbox"] = {
  defaultProps: {
    disableRipple: true,
    icon: <SvgColor src="/assets/icons/solid/checkbox-off.svg" />,
    checkedIcon: <SvgColor src="/assets/icons/solid/checkbox-on.svg" />,
  },
  styleOverrides: {
    root: {
      //textDecoration: "none",
    },
  },
};

const MuiDialogActions: Components<Theme>["MuiDialogActions"] = {
  styleOverrides: {
    root: ({ theme }) => ({
      padding: theme.spacing(0, 3, 2, 3),
    }),
  },
};

export const components = {
  MuiCard,
  MuiAvatar,
  MuiButton,
  MuiMenuItem,
  MuiCheckbox,
  MuiTableCell,
  MuiInputLabel,
  MuiCardHeader,
  MuiOutlinedInput,
  MuiDialogActions,
};
