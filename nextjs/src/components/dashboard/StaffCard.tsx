import { Card, CardContent, Typography, Avatar, Box, Grid, Alert, Button } from "@mui/material";
import { useStaffContext } from "@/context/StaffContext";
import { Assignment as AssignmentIcon, ContactPhone as ContactPhoneIcon } from "@mui/icons-material";
import { useState } from "react";
import moment from "moment";
import { useTasksContext } from "@/context/TasksContext";
import TaskCreateDialog from "../tasks/TaskCreateDialog";

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
  inManagementMode?: boolean;
  isOnCurrentShift: boolean;
};

const roleMap = {
  student_staff: "Student Staff",
  administrator: "Administrator",
};

const StaffCard = ({
  _id,
  firstName,
  lastName,
  shifts,
  tasksCompleted,
  picture,
  email,
  gender,
  phone,
  role,
  inManagementMode,
  isOnCurrentShift,
}: StaffCardProps) => {
  const [refetchLoading, setRefetchLoading] = useState<boolean>(false);
  const { taskDialogOpen, setTaskDialogOpen } = useTasksContext();

  type statusItem = {
    element: JSX.Element;
    condition: boolean;
  };

  type status = {
    warning: statusItem;
    success: statusItem;
  };

  const statuses: status = {
    warning: {
      element: <Alert severity="warning">Staff Member not on Shift.</Alert>,
      condition: !isOnCurrentShift,
    },
    success: {
      element: <Alert severity="success">Staff Member on Shift.</Alert>,
      condition: isOnCurrentShift,
    },
  };

  function getShiftsString(shifts: Array<{ startTime: Date; endTime: Date; active: boolean }>): string {
    return shifts
      .map((shift) => {
        return `${moment(shift.startTime).format("h:mm a")} - ${moment(shift.endTime).format("h:mm a")}`;
      })
      .join(", ")
      .toUpperCase();
  }

  return (
    <>
      <TaskCreateDialog open={taskDialogOpen} setOpen={setTaskDialogOpen} users={[_id]} />
      <Card
        elevation={0}
        sx={{
          border: "1px solid #999999",
          width: "100%",
          my: 1,
        }}
      >
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Avatar alt={`${firstName} ${lastName}`} variant="rounded" src={`data:image/png;base64,${picture}`} sx={{ width: 80, height: 80 }} />
            <Box
              sx={{
                marginLeft: 2,
                "& .MuiTypography-body1": {
                  fontWeight: "bold",
                  color: "#999999",
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                }}
                noWrap
                component="div"
              >
                {firstName} {lastName}
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={3}>
                  <Typography variant="body1" noWrap component="div">
                    time on shift today
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2" component="div">
                    {getShiftsString(shifts)}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body1" noWrap component="div">
                    tasks completed
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2" noWrap component="div">
                    {tasksCompleted}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body1" noWrap component="div">
                    phone
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2" noWrap component="div">
                    {phone}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body1" noWrap component="div">
                    Gender
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2" noWrap component="div">
                    {gender}
                  </Typography>
                </Grid>
                {inManagementMode && (
                  <>
                    <Grid item xs={3}>
                      <Typography variant="body1" noWrap component="div">
                        Role
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="body2" noWrap component="div">
                        {roleMap[role as keyof typeof roleMap]}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="body1" noWrap component="div">
                        Email
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="body2" noWrap component="div" sx={{ textTransform: "none" }}>
                        {email}
                      </Typography>
                    </Grid>
                  </>
                )}
              </Grid>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Button
              disabled={refetchLoading}
              variant="contained"
              startIcon={<AssignmentIcon />}
              onClick={() => {
                setTaskDialogOpen(true);
              }}
              size="small"
            >
              Assign Task
            </Button>
            <Button disabled={refetchLoading} variant="outlined" startIcon={<ContactPhoneIcon />} onClick={() => {}} size="small">
              Contact
            </Button>
          </Box>
        </CardContent>
        {
          Object.values(statuses).find((status) => {
            return status.condition;
          })!.element
        }
      </Card>
    </>
  );
};

export default StaffCard;
