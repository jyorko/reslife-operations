import React, { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  Grid,
  TextField,
  DialogActions,
  Button,
  DialogTitle,
  FormLabel,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Radio,
} from "@mui/material";
import axios from "@/axiosInstance";
import { Gender, useStaffContext } from "@/context/StaffContext";

export type UserCreateDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export enum Role {
  StudentStaff = "student_staff",
  Administrator = "administrator",
}

export type UserForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: Gender;
  role: Role;
};

export default function UserCreateDialog({ open, setOpen }: UserCreateDialogProps) {
  const [user, setUser] = React.useState<UserForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: Gender.Male,
    role: Role.StudentStaff,
  });
  const [loading, setLoading] = React.useState(false);
  const genderOptions = Object.values(Gender).filter((value) => value !== Gender.Unset);
  const { fetchStaff } = useStaffContext();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setUser({ ...user, [event.target.name]: event.target.value });
  }

  //   const { email, password, firstName, lastName, phone, gender, role } = req.body;
  function createUser() {
    setLoading(true);
    axios
      .post("/auth/signup", {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        gender: user.gender,
        role: user.role,
      })
      .then((res) => {
        console.log(res.data);
        setLoading(false);
        fetchStaff();
      });
  }

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Create User</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField fullWidth name="firstName" value={user.firstName} onChange={handleChange} placeholder="First Name" label="First Name" />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth name="lastName" value={user.lastName} onChange={handleChange} placeholder="Last Name" label="Last Name" />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth name="email" value={user.email} onChange={handleChange} placeholder="Email" label="Email" />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth name="phone" value={user.phone} onChange={handleChange} placeholder="Phone" label="Phone" />
          </Grid>
          <Grid item xs={7}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Gender</FormLabel>
              <RadioGroup row aria-label="gender" name="gender" value={user.gender} onChange={handleChange}>
                {genderOptions.map((gender) => (
                  <FormControlLabel key={gender} value={gender} control={<Radio />} label={gender.charAt(0).toUpperCase() + gender.slice(1)} />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={5}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Role</FormLabel>
              <RadioGroup row aria-label="role" name="role" value={user.role} onChange={handleChange}>
                {Object.values(Role).map((role) => (
                  <FormControlLabel key={role} value={role} control={<Radio />} label={role.charAt(0).toUpperCase() + role.slice(1).replace("_", " ")} />
                ))}
              </RadioGroup>
            </FormControl>
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
            createUser();
          }}
          variant="contained"
          color="primary"
        >
          Create User
        </Button>
      </DialogActions>
    </Dialog>
  );
}
