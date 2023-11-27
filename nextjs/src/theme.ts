import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";
import * as React from "react";
import useMediaQuery from "@mui/material/useMediaQuery";

const CustomTheme = () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
          primary: {
            main: "#2887c2",
          },
          secondary: {
            main: "#19857b",
          },
        },
        typography: {
          fontFamily: "var(--font-alliance)",
        },
        components: {
          MuiOutlinedInput: {
            styleOverrides: {
              input: {
                "&:-webkit-autofill": {
                  WebkitBoxShadow: "0 0 0 100px var(--primary-weak) inset",
                  WebkitTextFillColor: "var(--text-primary)",
                },
              },
            },
          },
        },
      }),
    [prefersDarkMode]
  );

  const lightThemeForChildComponents = createTheme({
    ...theme,
    palette: {
      mode: "light",
      primary: {
        main: "#33434f",
      },
    },
  });

  return { defaultTheme: theme, forcedLight: lightThemeForChildComponents };
};

export default CustomTheme;
