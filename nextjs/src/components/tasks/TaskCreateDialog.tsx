import React, { Dispatch, SetStateAction, useEffect } from "react";
import { Dialog, DialogContent, Grid, TextField, DialogActions, Button, DialogTitle, Autocomplete, CircularProgress } from "@mui/material";
import axios from "@/axiosInstance";
import { useTasksContext } from "@/context/TasksContext";
import StaffAutocompleteField from "../StaffAutocompleteField";
import { StaffCardProps } from "@/context/StaffContext";

export type TaskCreateDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  users?: string[];
  updateTask?: boolean;
  taskToUpdate?: Task;
};

export type Task = {
  _id: string;
  title: string;
  description: string;
  location: string;
  assignedTo: string[];
};

export default function TaskCreateDialog({ open, setOpen, updateTask, taskToUpdate, users }: TaskCreateDialogProps) {
  const { fetchTasks } = useTasksContext();
  const [task, setTask] = React.useState<Task>({
    _id: "",
    title: "",
    description: "",
    location: "",
    assignedTo: [],
  });

  useEffect(() => {
    if (updateTask && taskToUpdate) {
      setTask(taskToUpdate);
    }
    if (users) {
      setTask((prevTask: any) => ({
        ...prevTask,
        assignedTo: users,
      }));
    }
  }, [users, taskToUpdate, updateTask]);

  const [loading, setLoading] = React.useState(false);
  function addTaskHandler() {
    setLoading(true);
    axios
      .post("/task-create", task)
      .then((res) => {
        setLoading(false);
        fetchTasks();
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }

  function updateTaskHandler() {
    setLoading(true);
    axios
      .put("/task-update", task)
      .then((res) => {
        setLoading(false);
        fetchTasks();
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }

  const handleSelectionChange = (event: React.ChangeEvent<{}>, value: any[]) => {
    // Update task with selected staff IDs
    setTask((prevTask: any) => ({
      ...prevTask,
      assignedTo: value.map((v) => v.value), // Store only _id values
    }));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTask({ ...task, [event.target.name]: event.target.value });
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Create Task</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField fullWidth name="title" value={task.title} onChange={handleChange} placeholder="Title" label="Title" />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth name="description" value={task.description} onChange={handleChange} placeholder="Description" label="Description" />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth name="location" value={task.location} onChange={handleChange} placeholder="Location" label="Location" />
          </Grid>
          <Grid item xs={12}>
            <StaffAutocompleteField handleSelectionChange={handleSelectionChange} assignedTo={task.assignedTo} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => {
            setOpen(false);
            if (updateTask) {
              updateTaskHandler();
            } else {
              addTaskHandler();
            }
          }}
          disabled={loading}
          variant="contained"
          color="primary"
        >
          {updateTask ? "Update Task" : "Add Task"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
