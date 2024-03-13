"use client";
import { useEffect, useState } from "react";
import { Box, Table, Typography, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Avatar, Button } from "@mui/material";

import { blue } from "@mui/material/colors";
import moment, { Moment } from "moment";
import ShiftCreateDialog from "@/components/shifts/ShiftCreateDialog";
import { Shift, ShiftCellProps, ShiftRowProps, useShiftContext } from "@/context/ShiftContext";

const columnNames = ["Name", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const ManageShifts = () => {
  const [addShiftDialogOpen, setAddShiftDialogOpen] = useState<boolean>(false);
  const [clickedShiftDate, setClickedShiftDate] = useState<Date | null>(null);
  const { shifts, currentWeekStart, setCurrentWeekStart, fetchShifts } = useShiftContext();
  const [shiftsPerUser, setShiftsPerUser] = useState<Shift[][]>([]);

  useEffect(() => {
    const shiftsPerUser: Record<string, Shift[]> = {};

    shifts.forEach((shift) => {
      if (!shiftsPerUser[shift.userID._id]) {
        shiftsPerUser[shift.userID._id] = [];
      }

      shiftsPerUser[shift.userID._id].push(shift);
    });

    setShiftsPerUser(Object.values(shiftsPerUser));
  }, [shifts]);

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

  const handleShiftCellClick = (day: number) => {
    setAddShiftDialogOpen(true);
    const clickedShiftDay = moment(currentWeekStart)
      .add(day - 1, "days")
      .toDate();
    setClickedShiftDate(clickedShiftDay);
  };

  const ShiftRow: React.FC<ShiftRowProps> = ({ shifts, currentWeekStart }) => {
    return (
      <TableRow>
        <TableCell
          style={{
            position: "sticky",
            top: 0,
            borderLeft: "1px solid #ddd",
          }}
        >
          <Avatar>{shifts[0].userID.firstName[0].toUpperCase()}</Avatar> {`${shifts[0].userID.firstName} ${shifts[0].userID.lastName}`}
        </TableCell>
        {[1, 2, 3, 4, 5].map((dayIndex) => (
          <>
            {/* morning shift */}
            <ShiftCell
              onClick={() => handleShiftCellClick(dayIndex)}
              key={`${shifts[0]._id}-morning`}
              shifts={shifts}
              day={dayIndex}
              currentWeekStart={currentWeekStart}
              period="morning"
            />
            {/* afternoon shift */}
            <ShiftCell
              onClick={() => handleShiftCellClick(dayIndex)}
              key={`${shifts[0]._id}-morning`}
              shifts={shifts}
              day={dayIndex}
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
            {shiftsPerUser.map((shifts: any) => (
              <ShiftRow key={shifts[0]._id} shifts={shifts} currentWeekStart={currentWeekStart} />
            ))}
            {/* Empty shift row to be clicked */}
            <ShiftRow
              key="empty"
              shifts={[
                {
                  _id: "empty",
                  userID: {
                    _id: "empty",
                    firstName: " ",
                    lastName: " ",
                  },
                  startTime: "",
                  endTime: "",
                },
              ]}
              currentWeekStart={currentWeekStart}
            />
          </TableBody>
        </Table>
      </TableContainer>
      <ShiftCreateDialog open={addShiftDialogOpen} setOpen={setAddShiftDialogOpen} clickedShiftDate={clickedShiftDate} />
    </Box>
  );
};

const ShiftCell: React.FC<ShiftCellProps> = ({ shifts, day, period, currentWeekStart, onClick }) => {
  const today = moment(currentWeekStart);

  today.add(day - 1, "days");
  today
    .hours(period === "morning" ? 6 : 12)
    .minutes(0)
    .seconds(0)
    .milliseconds(0);

  const isSameDay = moment(shifts[0].startTime).isSame(today, "day");

  // const isMorningShift = isSameDay && moment(shifts[0].startTime).hours() < 12;
  // const isAfternoonShift = isSameDay && moment(shifts[0].startTime).hours() >= 12;

  // const shouldDisplayChip = (period === "morning" && isMorningShift) || (period === "afternoon" && isAfternoonShift);

  // // format date as per requirement
  // const formattedShift = `${moment(shifts[0].startTime).format("H:mm")} - ${moment(shifts[0].endTime).format("H:mm")}`;

  return (
    <TableCell
      onClick={onClick}
      align="center"
      sx={{
        border: "1px solid #ddd",
        minWidth: "110px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "4px",
          flexWrap: "wrap",
          width: "100%",
          padding: "4px",
        }}
      >
        {shifts.map((shift) => {
          const isSameDay = moment(shift.startTime).isSame(today, "day");

          const isMorningShift = isSameDay && moment(shift.startTime).hours() < 12;
          const isAfternoonShift = isSameDay && moment(shift.startTime).hours() >= 12;

          const shouldDisplayChip = (period === "morning" && isMorningShift) || (period === "afternoon" && isAfternoonShift);

          // format date as per requirement
          const formattedShift = `${moment(shift.startTime).format("H:mm")} - ${moment(shift.endTime).format("H:mm")}`;

          return shouldDisplayChip ? (
            <Chip
              label={formattedShift}
              color="primary"
              variant="outlined"
              style={{ borderColor: blue[800] }}
              avatar={<Avatar style={{ backgroundColor: blue[800] }} />}
              clickable
            />
          ) : null;
        })}
      </Box>
    </TableCell>
  );
};

export default ManageShifts;
