import { LIGHT_THEME } from "./LightTheme";

export interface Styles {
  container: any;
  input: any;
  button: any;
}

export const DEFAULT_STYLES: Styles = {
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: LIGHT_THEME.primaryBackground,
    color: LIGHT_THEME.primaryForeground,
  },
  input: {
    borderColor: LIGHT_THEME.inputBorder,
    borderStyle: "solid",
    borderWidth: "1px",
    backgroundColor: LIGHT_THEME.inputBackground,
    color: LIGHT_THEME.inputForeground,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    backgroundColor: LIGHT_THEME.buttonBackground,
    borderColor: LIGHT_THEME.buttonBorder,
    borderStyle: "solid",
    borderWidth: "1px",
    color: LIGHT_THEME.buttonForeground,
    // TODO - not working
    "&:hover": {
      backgroundColor: LIGHT_THEME.buttonBackgroundHover,
      borderColor: LIGHT_THEME.buttonBorderHover,
      color: LIGHT_THEME.buttonForegroundHover,
    },
  },
};
