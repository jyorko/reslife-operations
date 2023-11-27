"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CustomTheme from "../theme";
import { SnackbarContextProvider } from "@/context/SnackbarContext";

interface Props {
  children: React.ReactNode;
}

function Provider({ children }: Props) {
  const { defaultTheme } = CustomTheme();

  return (
    <SessionProvider>
      <ThemeProvider theme={defaultTheme}>
        <SnackbarContextProvider>{children}</SnackbarContextProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}

export default Provider;
