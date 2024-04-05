import { Card, CardContent, Typography, Avatar, Box, Grid, Alert, Button } from "@mui/material";
import { useStaffContext } from "@/context/StaffContext";
import { Assignment as AssignmentIcon, ContactPhone as ContactPhoneIcon } from "@mui/icons-material";
import { useState } from "react";
import moment from "moment";

export type StaffCardProps = {
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
};

const roleMap = {
  student_staff: "Student Staff",
  administrator: "Administrator",
};

const StaffCard = ({ firstName, lastName, shifts, tasksCompleted, picture, email, gender, phone, role, inManagementMode }: StaffCardProps) => {
  console.log(role);
  const [refetchLoading, setRefetchLoading] = useState<boolean>(false);
  const { setStaff } = useStaffContext();

  type statusItem = {
    element: JSX.Element;
    condition: boolean;
  };

  type status = {
    warning: statusItem;
    success: statusItem;
  };

  const randomNumber = Math.random();

  const statuses: status = {
    warning: {
      element: <Alert severity="warning">Staff Member not on Shift.</Alert>,
      condition: randomNumber > 0.6,
    },
    success: {
      element: <Alert severity="success">Staff Member on Shift.</Alert>,
      condition: randomNumber <= 0.6,
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
                <Typography variant="body2" noWrap component="div">
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
          <Button disabled={refetchLoading} variant="contained" startIcon={<AssignmentIcon />} onClick={() => {}} size="small">
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
  );
};

export default StaffCard;
