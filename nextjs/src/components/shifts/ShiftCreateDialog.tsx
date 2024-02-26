import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import {
  Dialog,
  DialogContent,
  Grid,
  TextField,
  DialogActions,
  Button,
  DialogTitle,
  Autocomplete,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Checkbox,
  FormGroup,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import StaffAutocompleteField from "../StaffAutocompleteField";

export type ShiftCreateDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  clickedShiftDate: Date | null;
};

export default function ShiftCreateDialog({ open, setOpen, clickedShiftDate }: ShiftCreateDialogProps) {
  const [shift, setShift] = useState({
    date: clickedShiftDate,
    recurring: false,
    startTime: dayjs("2022-04-17T15:30"),
    endTime: dayjs("2022-04-17T15:30"),
    assignedTo: [],
  });
  console.log(shift);

  useEffect(() => {
    setShift((prev) => ({ ...prev, date: clickedShiftDate }));
  }, [clickedShiftDate]);

  const handleSelectionChange = (event: React.ChangeEvent<{}>, value: any[]) => {
    setShift((prevShift: any) => ({
      ...prevShift,
      assignedTo: value.map((v) => v.value), // Store only _id values
    }));
  };

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
        </Grid>
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormGroup>
              <FormControlLabel
                control={<Checkbox checked={shift.recurring} onChange={() => setShift((prev) => ({ ...prev, recurring: !prev.recurring }))} />}
                label="Recurring"
              />
            </FormGroup>
          </FormControl>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button color="primary" variant="contained">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
