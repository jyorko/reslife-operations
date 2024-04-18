import React, { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import axios from "@/axiosInstance";
import { StaffCardProps } from "@/context/StaffContext";

interface AutocompleteStaffCardProps {
  _id: string;
  firstName: string;
  lastName: string;
  label: string;
  value: string;
}

interface StaffAutocompleteFieldProps {
  handleSelectionChange: (event: React.ChangeEvent<{}>, value: AutocompleteStaffCardProps[]) => void;
  assignedTo?: string[]; // Array of staff IDs (initially might not be empty).
}

export default function StaffAutocompleteField({ handleSelectionChange, assignedTo }: StaffAutocompleteFieldProps) {
  const [studentStaff, setStudentStaff] = useState<AutocompleteStaffCardProps[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<AutocompleteStaffCardProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [studentFilter, setStudentFilter] = useState({
    name: "",
    page: 1,
  });

  useEffect(() => {
    fetchStudentStaff();
  }, [studentFilter]);

  useEffect(() => {
    // Resolving assignedTo IDs to staff member objects
    if (!studentStaff.length || !assignedTo) return;
    const selected = studentStaff.filter((staff) => assignedTo.includes(staff._id));
    setSelectedStaff(selected);
  }, [assignedTo, studentStaff]);

  function fetchStudentStaff() {
    setLoading(true);
    axios
      .get("/student_staff", {
        params: {
          name: studentFilter.name,
          page: studentFilter.page,
        },
      })
      .then((res) => {
        const newStaff = res.data.results.map((staff: StaffCardProps) => ({
          ...staff,
          label: `${staff.firstName} ${staff.lastName}`,
          value: staff._id,
        }));
        setStudentStaff((prev) => (studentFilter.page > 1 ? [...prev, ...newStaff] : newStaff));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }

  const handleSearchChange = (event: any, value: string) => {
    setStudentFilter({ name: value, page: 1 });
  };

  const handleScrollToEnd = () => {
    setStudentFilter((prevFilter) => ({
      ...prevFilter,
      page: prevFilter.page + 1,
    }));
  };

  return (
    <Autocomplete
      multiple
      options={studentStaff}
      value={selectedStaff}
      onInputChange={handleSearchChange}
      onChange={(event, newValue) => {
        setSelectedStaff(newValue);
        handleSelectionChange(event, newValue);
      }}
      onScroll={handleScrollToEnd}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, value) => option._id === value._id}
      loading={loading}
      renderOption={(props, option) => (
        <li {...props} key={option._id}>
          {option.label}
        </li>
      )}
      renderTags={(value, getTagProps) => value.map((option, index) => <Chip {...getTagProps({ index })} key={option._id} label={option.label} />)}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Assign to"
          placeholder="Start typing to search..."
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}
