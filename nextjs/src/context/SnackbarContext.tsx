import { createContext, ReactNode, Dispatch, SetStateAction, useState } from "react";
import { Snackbar, Alert, AlertColor } from "@mui/material";
import axiosInstance from "@/axiosInstance";

type Snackbar = {
  open: boolean;
  severity: AlertColor;
  message: string;
};

interface SnackbarContextProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  severity: AlertColor;
  setSeverity: Dispatch<SetStateAction<AlertColor>>;
  message: string;
  setMessage: Dispatch<SetStateAction<string>>;
}

const SnackbarContext = createContext<SnackbarContextProps>({
  open: false,
  setOpen: () => {},
  severity: "success",
  setSeverity: () => {},
  message: "",
  setMessage: () => {},
});

export const SnackbarContextProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [severity, setSeverity] = useState<AlertColor>("success");
  const [message, setMessage] = useState<string>("");

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response) {
        setMessage(error.response.data.message);
        setSeverity("error");
        setOpen(true);
      }
      return Promise.reject(error);
    }
  );

  return (
    <SnackbarContext.Provider value={{ open, setOpen, severity, setSeverity, message, setMessage }}>
      {children}
      <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert onClose={() => setOpen(false)} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
