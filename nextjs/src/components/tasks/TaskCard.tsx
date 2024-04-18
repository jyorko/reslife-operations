"use client";
import { Card, CardContent, Box, Typography, Button, Alert, Grid } from "@mui/material";
import { useState } from "react";
import { Assignment as AssignmentIcon, Comment as CommentIcon } from "@mui/icons-material";
import { StaffCardProps } from "@/context/StaffContext";
import { useTasksContext } from "@/context/TasksContext";
import TaskCreateDialog from "./TaskCreateDialog";

export type TaskCardProps = {
  _id: string;
  title: string;
  description: string;
  location: string;
  status: string;
  assignedTo: StaffCardProps[];
  createdBy: StaffCardProps;
  toolsRequired: string[];
  comments: string[];
  dateCreated?: Date;
  dateCompleted?: Date;
};

const TaskCard = ({ _id, title, description, location, status, assignedTo, createdBy, toolsRequired, comments, dateCreated, dateCompleted }: TaskCardProps) => {
  const [refetchLoading, setRefetchLoading] = useState<boolean>(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState<boolean>(false); // Local instead of context to avoid unnecessary re-renders

  _id = _id || "1";
  title = title || "No title";
  description = description || "No description";
  location = location || "No location";
  status = status || "pending";
  assignedTo = assignedTo || [
    {
      firstName: "No",
      lastName: "one",
      shifts: [
        {
          startTime: new Date(),
          endTime: new Date(),
          active: false,
        },
      ],
      tasksCompleted: 0,
      email: "No email",
      picture: "No picture",
      gender: "male",
      phone: "No phone",
    },
  ];
  createdBy = createdBy || "No one";
  toolsRequired = toolsRequired || [];
  comments = comments || ["Few comments"];
  dateCreated = dateCreated || new Date();

  type statusItem = {
    element: JSX.Element;
    condition: boolean;
  };

  const statuses: { [key: string]: statusItem } = {
    pending: {
      element: <Alert severity="warning">Task Pending.</Alert>,
      condition: status === "pending",
    },
    in_progress: {
      element: <Alert severity="info">Task In Progress.</Alert>,
      condition: status === "in progress",
    },
    completed: {
      element: <Alert severity="success">Task Completed.</Alert>,
      condition: status === "completed",
    },
    unable_to_complete: {
      element: <Alert severity="error">Task Unable to Complete.</Alert>,
      condition: status === "unable to complete",
    },
  };

  return (
    <>
      <TaskCreateDialog
        open={taskDialogOpen}
        setOpen={setTaskDialogOpen}
        updateTask={true}
        taskToUpdate={{
          _id: _id,
          title: title,
          description: description,
          location: location,
          assignedTo: assignedTo.map((staff) => staff._id),
        }}
        users={assignedTo.map((staff) => staff._id)}
      />
      <Card elevation={0} sx={{ border: "1px solid #999999", width: "100%", my: 1 }}>
        <CardContent
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            textTransform: "capitalize",
          }}
        >
          <Box sx={{ "& .MuiTypography-body1": { fontWeight: "bold", color: "#999999" } }}>
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: "bold" }}>
              {title}
            </Typography>
            <Box sx={{ marginLeft: 2 }}>
              <Grid container spacing={1}>
                <Grid item xs={3}>
                  <Typography variant="body1" noWrap component="div">
                    Description:
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2" component="div">
                    {description}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body1" noWrap component="div">
                    Location:
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2" noWrap component="div">
                    {location}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body1" noWrap component="div">
                    Created by:
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2" noWrap component="div">
                    {createdBy.firstName} {createdBy.lastName}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body1" noWrap component="div">
                    Assigned to:
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2" noWrap component="div">
                    {assignedTo.map((staff) => `${staff.firstName} ${staff.lastName}`).join(", ")}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              disabled={refetchLoading}
              variant="contained"
              startIcon={<AssignmentIcon />}
              onClick={() => {
                setTaskDialogOpen(true);
              }}
              size="small"
            >
              Update
            </Button>
            <Button disabled={refetchLoading} variant="outlined" startIcon={<CommentIcon />} onClick={() => {}} size="small">
              View Comments ({comments.length})
            </Button>
          </Box>
        </CardContent>
        {Object.values(statuses).find((statusItem) => statusItem.condition)?.element}
      </Card>
    </>
  );
};

export default TaskCard;
