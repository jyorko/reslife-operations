import { useTasksContext } from "@/context/TasksContext";
import { TaskCardProps } from "./TaskCard";
import TaskCard from "./TaskCard";
import TaskCardSkeleton from "./TaskCardSkeleton";
import { Box, Typography } from "@mui/material";

const TaskCards = () => {
  const { Tasks, loading } = useTasksContext();

  return (
    <>
      {loading ? (
        [...Array(10)].map((_, i) => <TaskCardSkeleton key={i} />)
      ) : (
        <>
          {Tasks.map((task: TaskCardProps) => (
            <TaskCard key={task._id} {...task} />
          ))}
        </>
      )}
      {Tasks.length === 0 && !loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexGrow: 1,
            color: "grey.500",
          }}
        >
          <Typography variant="h6" component="div">
            No Tasks found.
          </Typography>
        </Box>
      )}
    </>
  );
};

export default TaskCards;
