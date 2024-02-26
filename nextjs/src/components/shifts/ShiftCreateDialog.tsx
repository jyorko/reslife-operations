import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import { Dialog, DialogContent, Grid, TextField, DialogActions, Button, DialogTitle, FormControl, FormControlLabel, Checkbox, FormGroup } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import StaffAutocompleteField from "../StaffAutocompleteField";
import axios from "@/axiosInstance";
import { useShiftContext } from "@/context/ShiftContext";

export type ShiftCreateDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  clickedShiftDate: Date | null;
};

export default function ShiftCreateDialog({ open, setOpen, clickedShiftDate }: ShiftCreateDialogProps) {
  const [shift, setShift] = useState({
    date: clickedShiftDate,
    recurring: false,
    recurringEndDate: dayjs().add(4, "month").toDate(),
    startTime: dayjs("2022-04-17T15:30"),
    endTime: dayjs("2022-04-17T15:30"),
    assignedTo: [],
  });
  const [loading, setLoading] = useState(false);
  const { fetchShifts } = useShiftContext();

  console.log(shift);

  useEffect(() => {
    // set startTIme and endTime to clickedShiftDate (08:00 and 16:00 respectively)
    setShift((prev) => ({
      ...prev,
      date: clickedShiftDate,
      startTime: dayjs(clickedShiftDate).set("hour", 8),
      endTime: dayjs(clickedShiftDate).set("hour", 16),
    }));
  }, [clickedShiftDate]);

  const handleSelectionChange = (event: React.ChangeEvent<{}>, value: any[]) => {
    setShift((prevShift: any) => ({
      ...prevShift,
      assignedTo: value.map((v) => v.value), // Store only _id values
    }));
  };

  function addShift() {
    setLoading(true);
    axios
      .post("/shift-create", shift)
      .then((res) => {
        setLoading(false);
        fetchShifts();
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Add Shift</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField fullWidth name="date" value={clickedShiftDate?.toDateString()} label="Date" disabled />
          </Grid>

          <Grid item xs={6}>
            <TimePicker label="Start Time" value={shift.startTime} onChange={(newValue) => setShift((prev: any) => ({ ...prev, startTime: newValue }))} />
          </Grid>
          <Grid item xs={6}>
            <TimePicker label="End Time" value={shift.endTime} onChange={(newValue) => setShift((prev: any) => ({ ...prev, endTime: newValue }))} />
          </Grid>
          <Grid item xs={12}>
            <StaffAutocompleteField handleSelectionChange={handleSelectionChange} />
          </Grid>
          <Grid item xs={4}>
            <FormControl component="fieldset">
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={shift.recurring} onChange={() => setShift((prev) => ({ ...prev, recurring: !prev.recurring }))} />}
                  label="Recurring"
                />
              </FormGroup>
            </FormControl>
          </Grid>
          {shift.recurring && (
            <Grid item xs={8}>
              <TextField
                fullWidth
                type="date"
                label="Recurring End Date"
                value={dayjs(shift.recurringEndDate).format("YYYY-MM-DD")}
                onChange={(e) => setShift((prev) => ({ ...prev, recurringEndDate: dayjs(e.target.value).toDate() }))}
              />
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button color="primary" variant="contained" onClick={addShift} disabled={loading}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
