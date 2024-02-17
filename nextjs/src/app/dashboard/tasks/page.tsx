"use client";

import TaskCard from "@/components/tasks/TaskCard";
import TaskCardSkeleton from "@/components/tasks/TaskCardSkeleton";
import TaskCards from "@/components/tasks/TaskCards";
import TaskSearchCard from "@/components/tasks/TaskSearchCard";

export default function Tasks() {
  return (
    <>
      <TaskSearchCard />
      <TaskCards />
    </>
  );
}
