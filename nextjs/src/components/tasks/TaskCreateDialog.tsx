import React, { Dispatch, SetStateAction, useEffect } from "react";
import { Dialog, DialogContent, Grid, TextField, DialogActions, Button, DialogTitle, Autocomplete, CircularProgress } from "@mui/material";
import axios from "@/axiosInstance";
import { StaffCardProps } from "@/context/StaffContext";

export type TaskCreateDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

interface AutocompleteStaffCardProps extends StaffCardProps {
  label: string;
  value: string;
}

export default function TaskCreateDialog({ open, setOpen }: TaskCreateDialogProps) {
  const [task, setTask] = React.useState({
    title: "",
    description: "",
    location: "",
    assignedTo: [],
  });

  const [loading, setLoading] = React.useState(false);
  const [studentStaff, setStudentStaff] = React.useState<AutocompleteStaffCardProps[]>([]);
  const [studentFilter, setStudentFilter] = React.useState({
    name: "",
    page: 1,
  });
  console.log(task);
  useEffect(() => {
    // Fetch initial student staff on component mount or studentFilter change
    fetchStudentStaff();
  }, [studentFilter]);

  function fetchStudentStaff() {
    setLoading(true);
    axios
      .get("/student_staff", {
        params: {
          name: studentFilter.name,
          page: studentFilter.page,
        },
      })
      .then((res) => {
        const newStaff = res.data.results.map((staff: AutocompleteStaffCardProps) => ({
          ...staff,
          label: `${staff.firstName} ${staff.lastName}`,
          value: staff._id,
        }));
        // Append new staff if we're paginating, replace if new search
        if (studentFilter.page > 1) {
          setStudentStaff((prev) => [...prev, ...newStaff]);
        } else {
          setStudentStaff(newStaff);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }

  const handleSearchChange = (event: React.ChangeEvent<{}>, value: string) => {
    setStudentFilter({
      name: value,
      page: 1, // Reset to page 1 for new searches
    });
  };

  const handleScrollToEnd = () => {
    setStudentFilter((prevFilter) => ({
      ...prevFilter,
      page: prevFilter.page + 1,
    }));
  };

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
            <Autocomplete
              defaultValue={[]}
              multiple
              options={studentStaff}
              onInputChange={handleSearchChange}
              onChange={handleSelectionChange}
              onScroll={handleScrollToEnd}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, value) => option.value === value.value}
              loading={loading}
              renderInput={(params) => {
                return (
                  <TextField
                    {...params}
                    // set staff ._id as key
                    key={params.id}
                    label="Assign to"
                    placeholder="Start typing to search..."
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {loading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }}
                  />
                );
              }}
            />
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
            //   fetchTasks();
          }}
          variant="contained"
          color="primary"
        >
          Add Task
        </Button>
      </DialogActions>
    </Dialog>
  );
}
