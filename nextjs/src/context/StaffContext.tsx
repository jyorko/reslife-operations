"use client";
import { createContext, useContext, Dispatch, SetStateAction, useState, PropsWithChildren } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import axios from "@/axiosInstance";

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
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
  role: string;
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
  fetchStaff: (studentStaffOnly?: boolean) => void;
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
  fetchStaff: () => {},
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

  function fetchStaff(studentStaffOnly?: boolean) {
    setStaff([]);
    setLoading(true);
    axios
      .get("/student_staff", {
        params: {
          ...filter,
          studentStaffOnly,
        },
      })
      .then((res) => {
        const mappedStaff: StaffCardProps[] = res.data.results.map((staff: any) => ({
          firstName: staff.firstName,
          lastName: staff.lastName,
          shifts: staff.shifts,
          tasksCompleted: staff.tasksCompleted,
          email: staff.email,
          picture: staff.picture,
          gender: staff.gender,
          phone: staff.phone,
          role: staff.role,
        }));

        setStaff(mappedStaff);
        setTotalPages(res.data.pages);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }

  return (
    <StaffContext.Provider value={{ setFilter, filter, Staff, setStaff, loading, setLoading, totalPages, setTotalPages, fetchStaff }}>
      {children}
    </StaffContext.Provider>
  );
};

export const useStaffContext = () => useContext(StaffContext);
