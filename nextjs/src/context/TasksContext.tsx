"use client";
import { createContext, useContext, Dispatch, SetStateAction, useState, PropsWithChildren } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { TaskCardProps } from "@/components/tasks/TaskCard";

type Filter = {
  userID: string;
  taskName: string;
  period_from: string;
  period_to: string;
  status: string;
  location: string;
  page: number;
};

interface FilterContextProps {
  setFilter: Dispatch<SetStateAction<Filter>>;
  filter: Filter;
  Tasks: TaskCardProps[];
  setTasks: Dispatch<SetStateAction<TaskCardProps[]>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  totalPages: number;
  setTotalPages: Dispatch<SetStateAction<number>>;
}

const TasksContext = createContext<FilterContextProps>({
  setFilter: () => {},
  filter: {} as Filter,
  Tasks: [],
  setTasks: () => {},
  loading: true,
  setLoading: () => {},
  totalPages: 1,
  setTotalPages: () => {},
});

export const TasksContextProvider = ({ children }: PropsWithChildren) => {
  const [Tasks, setTasks] = useState<TaskCardProps[]>([]);
  const [filter, setFilter] = useState<Filter>({
    userID: "",
    taskName: "",
    period_from: "",
    period_to: "",
    status: "",
    location: "",
    page: 1,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState(1);

  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams) {
      const page = searchParams.get("page") ? parseInt(searchParams.get("page") as string) : 1;
      setFilter({ ...filter, page });
    }
  }, [searchParams]);

  return (
    <TasksContext.Provider value={{ setFilter, filter, Tasks, setTasks, loading, setLoading, totalPages, setTotalPages }}>{children}</TasksContext.Provider>
  );
};

export const useTasksContext = () => useContext(TasksContext);
