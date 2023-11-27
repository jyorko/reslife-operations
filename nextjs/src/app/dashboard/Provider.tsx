"use client";
import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import CustomTheme from "../../theme";
import { StaffContextProvider } from "@/context/StaffContext";

interface Props {
  children: React.ReactNode;
}

function Provider({ children }: Props) {
  const { forcedLight } = CustomTheme();

  return (
    <ThemeProvider theme={forcedLight}>
      <StaffContextProvider>{children}</StaffContextProvider>
    </ThemeProvider>
  );
}

export default Provider;
