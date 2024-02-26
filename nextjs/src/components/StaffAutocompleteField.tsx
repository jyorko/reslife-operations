import { StaffCardProps } from "@/context/StaffContext";
import axios from "@/axiosInstance";
import React, { useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";

interface AutocompleteStaffCardProps extends StaffCardProps {
  label: string;
  value: string;
}

interface StaffAutocompleteFieldProps {
  handleSelectionChange: (event: React.ChangeEvent<{}>, value: any[]) => void;
}

export default function StaffAutocompleteField({ handleSelectionChange }: StaffAutocompleteFieldProps) {
  const [studentStaff, setStudentStaff] = React.useState<AutocompleteStaffCardProps[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [studentFilter, setStudentFilter] = React.useState({
    name: "",
    page: 1,
  });

  useEffect(() => {
    fetchStudentStaff();
  }, [studentFilter]);

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
        const newStaff = res.data.results.map((staff: AutocompleteStaffCardProps) => ({
          ...staff,
          label: `${staff.firstName} ${staff.lastName}`,
          value: staff._id,
        }));
        // Append new staff if we're paginating, replace if new search
        if (studentFilter.page > 1) {
          setStudentStaff((prev) => [...prev, ...newStaff]);
        } else {
          setStudentStaff(newStaff);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }

  const handleSearchChange = (event: React.ChangeEvent<{}>, value: string) => {
    setStudentFilter({
      name: value,
      page: 1, // Reset to page 1 for new searches
    });
  };

  const handleScrollToEnd = () => {
    setStudentFilter((prevFilter) => ({
      ...prevFilter,
      page: prevFilter.page + 1,
    }));
  };

  return (
    <Autocomplete
      defaultValue={[]}
      multiple
      options={studentStaff}
      onInputChange={handleSearchChange}
      onChange={handleSelectionChange}
      onScroll={handleScrollToEnd}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      loading={loading}
      renderOption={(props, option) => (
        <li {...props} key={option.value}>
          {option.label}
        </li>
      )}
      renderTags={(value, getTagProps) => value.map((option, index) => <Chip {...getTagProps({ index })} key={option.value} label={option.label} />)}
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
