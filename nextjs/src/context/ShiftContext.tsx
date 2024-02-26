"use client";
import { createContext, useContext, Dispatch, SetStateAction, useState, PropsWithChildren } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import moment, { Moment } from "moment";
import axios from "@/axiosInstance";

export interface Shift {
  _id: string;
  userID: {
    firstName: string;
    lastName: string;
  };
  startTime: string;
  endTime: string;
}

export interface ShiftCellProps {
  shift: Shift;
  day: number;
  startTime: moment.Moment;
  endTime: moment.Moment;
  period: "morning" | "afternoon";
  currentWeekStart: moment.Moment;
  onClick?: () => void;
}

export interface ShiftRowProps {
  shift: Shift;
  currentWeekStart: Moment;
}

interface ShiftContextProps {
  shifts: Shift[];
  setShifts: Dispatch<SetStateAction<Shift[]>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  currentWeekStart: Moment;
  setCurrentWeekStart: Dispatch<SetStateAction<Moment>>;
  fetchShifts: () => void;
}

const ShiftContext = createContext<ShiftContextProps>({
  shifts: [],
  setShifts: () => {},
  loading: true,
  setLoading: () => {},
  currentWeekStart: moment().startOf("isoWeek"),
  setCurrentWeekStart: () => {},
  fetchShifts: () => {},
});

export const ShiftContextProvider = ({ children }: PropsWithChildren) => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(moment().startOf("isoWeek"));

  function fetchShifts() {
    setLoading(true);
    axios
      .get("/shifts", {
        params: {
          period_from: currentWeekStart.format("YYYY-MM-DD"),
          period_to: currentWeekStart.clone().endOf("isoWeek").format("YYYY-MM-DD"),
        },
      })
      .then((res) => {
        setShifts(res.data.results);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }

  return (
    <ShiftContext.Provider value={{ shifts, setShifts, loading, setLoading, currentWeekStart, setCurrentWeekStart, fetchShifts }}>
      {children}
    </ShiftContext.Provider>
  );
};

export const useShiftContext = () => useContext(ShiftContext);
