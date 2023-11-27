import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
  Card,
  CardContent,
  Checkbox,
  FormGroup,
  IconButton,
  InputBase,
  Divider,
  Button,
  Dialog,
  DialogContent,
  TextField,
  DialogActions,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stack,
  Chip,
  useMediaQuery,
  Theme,
  Box,
  LinearProgress,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import { useStaffContext, StaffCardProps } from "@/context/StaffContext";
import axios from "@/axiosInstance";

export default function SearchCard() {
  const { filter, setFilter, loading, setLoading, setStaff, setTotalPages } = useStaffContext();
  const [open, setOpen] = React.useState<boolean>(false);
  const isWideScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up("sm"));

  function fetchStaff() {
    setStaff([]);
    setLoading(true);
    axios
      .get("/student_staff", {
        params: {
          ...filter,
        },
      })
      .then((res) => {
        const mappedStaff: StaffCardProps[] = res.data.results.map((staff: any) => ({
          firstName: staff.firstName,
          lastName: staff.lastName,
          shifts: staff.shifts,
          tasksCompleted: staff.tasksCompleted,
          email: staff.email,
          picture: staff.picture,
          gender: staff.gender,
          phone: staff.phone,
        }));

        setStaff(mappedStaff);
        setTotalPages(res.data.pages);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }

  React.useEffect(() => {
    fetchStaff();
  }, [filter.page]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ ...filter, [event.target.name]: event.target.value });
  };
  const handlePhoneChange = (value: string) => {
    setFilter({ ...filter, phone: value });
  };

  return (
    <>
      <Card
        sx={{
          width: "100%",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Search>
            <SearchIconWrapper
              sx={{
                zIndex: 2,
              }}
            >
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  fetchStaff();
                }
              }}
              name="name"
              value={filter.name}
              onChange={handleChange}
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              marginTop: { xs: 2, sm: 0 },
            }}
          >
            <Divider
              sx={{
                height: isWideScreen ? 28 : 1,
                marginLeft: 2,
              }}
              orientation={isWideScreen ? "vertical" : "horizontal"}
            />
            <IconButton
              color="primary"
              aria-label="filter"
              sx={{
                p: "10px",
              }}
              onClick={handleClickOpen}
            >
              <FilterAltIcon />
            </IconButton>

            <Button disableElevation variant="contained" color="primary" onClick={fetchStaff} disabled={loading}>
              Search
            </Button>
          </Box>
          {/* Group of removable chips describing active filter */}
          <Stack direction={{ xs: "column", sm: "row" }}>
            {Object.keys(filter).map((key) => {
              // If value is empty string, don't render chip
              // if key is page, don't render chip
              if (filter[key as keyof typeof filter] === "" || key === "page") return null;
              return (
                <Chip
                  key={key}
                  label={`${key}: ${filter[key as keyof typeof filter]}`}
                  onDelete={() => setFilter({ ...filter, [key]: "" })}
                  sx={{
                    m: 1,
                  }}
                />
              );
            })}
          </Stack>
        </CardContent>
        {loading && (
          <LinearProgress
            sx={{
              height: 2,
            }}
          />
        )}
      </Card>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogContent>
          <FormControl component="fieldset">
            <FormLabel component="legend">Gender</FormLabel>
            <RadioGroup row name="gender" onChange={handleChange}>
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel value="female" control={<Radio />} label="Female" />
            </RadioGroup>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <FormLabel component="legend">Phone Number</FormLabel>
            <TextField
              variant="outlined"
              name="phone"
              value={filter.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              inputProps={{ minLength: 9, maxLength: 9 }}
            />
          </FormControl>

          {/* Checkbox for if Staff has picture in db or not */}
          <FormControl fullWidth margin="normal">
            <FormGroup>
              <FormControlLabel
                control={<Checkbox checked={filter.hasPicture} onChange={(e) => setFilter({ ...filter, hasPicture: e.target.checked })} name="hasPicture" />}
                label="Has Picture"
              />
            </FormGroup>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} variant="contained" color="primary">
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    backgroundColor: "#ebf1f6",
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));
