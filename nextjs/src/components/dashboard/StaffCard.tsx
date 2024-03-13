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
};

const StaffCard = ({ firstName, lastName, shifts, tasksCompleted, picture, email, gender, phone }: StaffCardProps) => {
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
                  {/* {moment(shifts[0].startTime).format("HH:mm")} - {moment(shifts[0].endTime).format("HH:mm")} */}
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
