"use client";
import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import CustomTheme from "../../../theme";
import { StaffContextProvider } from "@/context/StaffContext";
import { TasksContextProvider } from "@/context/TasksContext";

interface Props {
  children: React.ReactNode;
}

function Provider({ children }: Props) {
  const { forcedLight } = CustomTheme();

  return <TasksContextProvider>{children}</TasksContextProvider>;
}

export default Provider;
