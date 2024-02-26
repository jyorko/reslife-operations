"use client";
import { useEffect, useState } from "react";
import axios from "@/axiosInstance";
import { Box, Table, Typography, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Avatar, Button } from "@mui/material";

import { blue } from "@mui/material/colors";
import moment, { Moment } from "moment";
import ShiftCreateDialog from "@/components/shifts/ShiftCreateDialog";

const columnNames = ["Name", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

interface Shift {
  _id: string;
  userID: {
    firstName: string;
    lastName: string;
  };
  startTime: string; // Assuming startTime is a string, adjust accordingly
  endTime: string; // Same as above
}

interface ShiftCellProps {
  shift: Shift;
  day: number;
  startTime: moment.Moment; // Assuming startTime is a moment object
  endTime: moment.Moment; // Same as above
  period: "morning" | "afternoon";
  currentWeekStart: moment.Moment;
  onClick?: () => void;
}

interface ShiftRowProps {
  shift: Shift;
  currentWeekStart: Moment;
}

const ManageShifts = () => {
  const [shifts, setShifts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [addShiftDialogOpen, setAddShiftDialogOpen] = useState<boolean>(false);
  const [clickedShiftDate, setClickedShiftDate] = useState<Date | null>(null);
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

  const handleShiftCellClick = (shift: Shift, day: number) => {
    setAddShiftDialogOpen(true);
    console.log(shift);
    console.log(day);
    const clickedShiftDay = moment(currentWeekStart)
      .add(day - 1, "days")
      .toDate();
    setClickedShiftDate(clickedShiftDay);
  };

  const ShiftRow: React.FC<ShiftRowProps> = ({ shift, currentWeekStart }) => {
    // const startTime = new Date(shift.startTime);
    // const endTime = new Date(shift.endTime);
    //StartTime and endtime are in UTC. I want to render them as is (in UTC) and not convert them to local time.
    const startTime = moment.utc(shift.startTime);
    const endTime = moment.utc(shift.endTime);

    return (
      <TableRow>
        <TableCell
          style={{
            position: "sticky",
            top: 0,
            borderLeft: "1px solid #ddd",
          }}
        >
          <Avatar>{shift.userID.firstName[0].toUpperCase()}</Avatar> {`${shift.userID.firstName} ${shift.userID.lastName}`}
        </TableCell>
        {[1, 2, 3, 4, 5].map((dayIndex) => (
          <>
            {/* morning shift */}
            <ShiftCell
              onClick={() => handleShiftCellClick(shift, dayIndex)}
              key={`${shift._id}-morning`}
              shift={shift}
              day={dayIndex}
              startTime={startTime}
              endTime={endTime}
              currentWeekStart={currentWeekStart}
              period="morning"
            />
            {/* afternoon shift */}
            <ShiftCell
              onClick={() => handleShiftCellClick(shift, dayIndex)}
              key={`${shift._id}-afternoon`}
              shift={shift}
              day={dayIndex}
              startTime={startTime}
              endTime={endTime}
              currentWeekStart={currentWeekStart}
              period="afternoon"
            />
          </>
        ))}
      </TableRow>
    );
  };

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
              <ShiftRow key={shift._id} shift={shift} currentWeekStart={currentWeekStart} />
            ))}
            {/* Empty shift row to be clicked */}
            <ShiftRow
              key="empty"
              shift={{
                _id: "empty",
                userID: {
                  firstName: " ",
                  lastName: " ",
                },
                startTime: "",
                endTime: "",
              }}
              currentWeekStart={currentWeekStart}
            />
          </TableBody>
        </Table>
      </TableContainer>
      <ShiftCreateDialog open={addShiftDialogOpen} setOpen={setAddShiftDialogOpen} clickedShiftDate={clickedShiftDate} />
    </Box>
  );
};

const ShiftCell: React.FC<ShiftCellProps> = ({ shift, day, startTime, endTime, period, currentWeekStart, onClick }) => {
  const today = moment(currentWeekStart);

  today.add(day - 1, "days");
  today
    .hours(period === "morning" ? 6 : 12)
    .minutes(0)
    .seconds(0)
    .milliseconds(0);

  const isSameDay = moment(startTime).isSame(today, "day");

  const isMorningShift = isSameDay && startTime.hours() < 12;
  const isAfternoonShift = isSameDay && startTime.hours() >= 12;

  const shouldDisplayChip = (period === "morning" && isMorningShift) || (period === "afternoon" && isAfternoonShift);

  // format date as per requirement
  const formattedShift = `${startTime.format("H:mm")} - ${endTime.format("H:mm")}`;

  return (
    <TableCell
      onClick={onClick}
      align="center"
      style={{
        border: "1px solid #ddd",
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
