"use client";
import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import CustomTheme from "../../theme";
import { StaffContextProvider } from "@/context/StaffContext";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { TasksContextProvider } from "@/context/TasksContext";
import { ShiftContextProvider } from "@/context/ShiftContext";

interface Props {
  children: React.ReactNode;
}

function Provider({ children }: Props) {
  const { forcedLight } = CustomTheme();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={forcedLight}>
        <StaffContextProvider>
          <ShiftContextProvider>
            <TasksContextProvider>{children}</TasksContextProvider>
          </ShiftContextProvider>
        </StaffContextProvider>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default Provider;
