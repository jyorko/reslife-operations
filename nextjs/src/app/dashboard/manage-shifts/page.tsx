"use client";
import { useEffect, useState } from "react";
import axios from "@/axiosInstance";
import { Box, Table, Typography, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Avatar, Button } from "@mui/material";
import { blue } from "@mui/material/colors";
import moment from "moment";

const columnNames = ["Name", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const ManageShifts = () => {
  const [shifts, setShifts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(moment().startOf("isoWeek"));

  function fetchShifts() {
    setLoading(true);
    axios
      .get("/shifts", {
        params: {
          period_from: currentWeekStart.format("YYYY-MM-DD"),
          period_to: currentWeekStart.clone().endOf("isoWeek").format("YYYY-MM-DD"),
        },
      })
      .then((res) => {
        setShifts(res.data.results);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }

  const goToNextWeek = () => {
    setCurrentWeekStart(currentWeekStart.clone().add(1, "weeks"));
  };

  // Function to go to the previous week
  const goToPreviousWeek = () => {
    setCurrentWeekStart(currentWeekStart.clone().subtract(1, "weeks"));
  };

  // Fetch shifts whenever the currentWeekStart changes
  useEffect(() => {
    fetchShifts();
  }, [currentWeekStart]);

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
        <Button onClick={goToPreviousWeek}>&lt; Previous</Button>
        <Typography variant="h6">Week of {currentWeekStart.format("MMM Do")}</Typography>
        <Button onClick={goToNextWeek}>Next &gt;</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="shifts table">
          <TableHead>
            <TableRow>
              {columnNames.map((column, index) => (
                <TableCell
                  key={column}
                  style={{
                    //give border to the first column
                    borderLeft: "1px solid #ddd",
                  }}
                  align="center"
                  colSpan={index === 0 ? 1 : 2}
                >
                  {column}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              {Array(columnNames.length * 2 - 1)
                .fill(null)
                .map((_, index) => (
                  <TableCell
                    key={index}
                    style={{
                      padding: "0 2px",
                      borderLeft: "1px solid #ddd",
                    }}
                  >
                    {index !== 0 && <Typography variant="caption">{index % 2 === 0 ? "Afternoon" : "Morning"}</Typography>}
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {shifts.map((shift: any) => (
              <ShiftRow key={shift._id} shift={shift} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const ShiftRow = ({ shift }) => {
  const startTime = new Date(shift.startTime);
  const endTime = new Date(shift.endTime);

  return (
    <TableRow>
      <TableCell
        style={{
          position: "sticky",
          top: 0,
          //give border to the first column
          borderLeft: "1px solid #ddd",
        }}
      >
        <Avatar>{shift.userID.firstName[0].toUpperCase()}</Avatar> {`${shift.userID.firstName} ${shift.userID.lastName}`}
      </TableCell>
      {[1, 2, 3, 4, 5].map((dayIndex) => (
        <>
          {/* morning shift */}
          <ShiftCell key={`${shift._id}-morning`} shift={shift} day={dayIndex} startTime={startTime} endTime={endTime} period="morning" />
          {/* afternoon shift */}
          <ShiftCell key={`${shift._id}-afternoon`} shift={shift} day={dayIndex} startTime={startTime} endTime={endTime} period="afternoon" />
        </>
      ))}
    </TableRow>
  );
};

const ShiftCell = ({ shift, day, startTime, endTime, period }) => {
  const today = new Date();
  today.setDate(today.getDate() - today.getDay() + (day - 1));
  today.setHours(period === "morning" ? 6 : 12, 0, 0, 0); //consider 'morning' as 6 AM and 'afternoon' as 12 PM

  const isSameDay = startTime.getDate() === today.getDate() && startTime.getMonth() === today.getMonth();

  const isMorningShift = isSameDay && startTime.getHours() < 12;
  const isAfternoonShift = isSameDay && startTime.getHours() >= 12;

  const shouldDisplayChip = (period === "morning" && isMorningShift) || (period === "afternoon" && isAfternoonShift);

  // format date as per requirement
  const formattedShift = `${startTime.getHours()}:00 - ${endTime.getHours()}:00`;

  return (
    <TableCell
      align="center"
      style={{
        border: "1px solid #ddd",
        //give max width to the cell
        minWidth: "110px",
      }}
    >
      {shouldDisplayChip ? (
        <Chip
          label={formattedShift}
          color="primary"
          variant="outlined"
          style={{ borderColor: blue[800] }}
          avatar={<Avatar style={{ backgroundColor: blue[800] }} />}
          clickable
        />
      ) : null}
    </TableCell>
  );
};

export default ManageShifts;
