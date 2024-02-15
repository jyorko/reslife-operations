"use client";
import { createContext, useContext, Dispatch, SetStateAction, useState, PropsWithChildren } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

enum Gender {
  Male = "male",
  Female = "female",
  Unset = "",
}

type Filter = {
  name: string;
  gender: Gender;
  phone: string;
  page: number;
  privateNumber: string;
  hasPicture?: boolean;
};

export type StaffCardProps = {
  _id: string;
  firstName: string;
  lastName: string;
  shifts: Array<{
    startTime: Date;
    endTime: Date;
    active: boolean;
  }>;
  tasksCompleted: number;
  email: string;
  picture: string;
  gender: string;
  phone: string;
};

interface FilterContextProps {
  setFilter: Dispatch<SetStateAction<Filter>>;
  filter: Filter;
  Staff: StaffCardProps[];
  setStaff: Dispatch<SetStateAction<StaffCardProps[]>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  totalPages: number;
  setTotalPages: Dispatch<SetStateAction<number>>;
}

const StaffContext = createContext<FilterContextProps>({
  setFilter: () => {},
  filter: {} as Filter,
  Staff: [],
  setStaff: () => {},
  loading: true,
  setLoading: () => {},
  totalPages: 1,
  setTotalPages: () => {},
});

export const StaffContextProvider = ({ children }: PropsWithChildren) => {
  const [Staff, setStaff] = useState<StaffCardProps[]>([]);
  const [filter, setFilter] = useState<Filter>({
    gender: Gender.Unset,
    phone: "",
    name: "",
    page: 1,
    privateNumber: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);

  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams) {
      const page = searchParams.get("page") ? parseInt(searchParams.get("page") as string) : 1;
      setFilter({ ...filter, page });
    }
  }, [searchParams]);

  return (
    <StaffContext.Provider value={{ setFilter, filter, Staff, setStaff, loading, setLoading, totalPages, setTotalPages }}>{children}</StaffContext.Provider>
  );
};

export const useStaffContext = () => useContext(StaffContext);
