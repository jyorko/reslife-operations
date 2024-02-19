"use client";
import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
  Box,
  Card,
  CardContent,
  IconButton,
  InputBase,
  Divider,
  Button,
  Dialog,
  DialogContent,
  TextField,
  DialogActions,
  Grid,
  useMediaQuery,
  Theme,
  Stack,
  Chip,
} from "@mui/material";
import MuiRadio, { RadioProps } from "@mui/material/Radio";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { styled, alpha } from "@mui/material/styles";
import { useTasksContext } from "@/context/TasksContext";
import TaskCreateDialog from "./TaskCreateDialog";

export default function TaskSearchCard() {
  const { filter, setFilter, loading, setLoading, setTasks, setTotalPages, fetchTasks } = useTasksContext();
  const [open, setOpen] = React.useState<boolean>(false);
  const [taskDialogOpen, setTaskDialogOpen] = React.useState<boolean>(false);
  const isWideScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up("sm"));

  React.useEffect(() => {
    fetchTasks();
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

  return (
    <>
      <Card sx={{ width: "100%" }}>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Search>
            <SearchIconWrapper sx={{ zIndex: 2 }}>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  fetchTasks();
                }
              }}
              name="taskName"
              value={filter.taskName}
              onChange={handleChange}
              placeholder="Search by ID…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          <Box sx={{ display: "flex", marginTop: { xs: 2, sm: 0 } }}>
            <Divider sx={{ height: isWideScreen ? 28 : 1, marginLeft: 2 }} orientation={isWideScreen ? "vertical" : "horizontal"} />
            <IconButton color="primary" sx={{ p: "10px" }} onClick={handleClickOpen}>
              <FilterAltIcon />
            </IconButton>
            <Button disableElevation variant="contained" color="primary" onClick={fetchTasks} disabled={loading}>
              Search
            </Button>
          </Box>
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
          <Button
            sx={{ marginLeft: "auto" }}
            startIcon={<AddCircleIcon />}
            variant="contained"
            color="primary"
            disableElevation
            onClick={() => setTaskDialogOpen(true)}
          >
            Add Task
          </Button>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField id="period_from" label="Period From" type="date" fullWidth InputLabelProps={{ shrink: true }}></TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField id="period_to" label="Period To" type="date" fullWidth InputLabelProps={{ shrink: true }}></TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth name="location" value={filter.location} onChange={handleChange} placeholder="Location" label="Location" />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                name="status"
                value={filter.status}
                onChange={handleChange}
                label="Status"
                SelectProps={{
                  native: true,
                }}
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="unable_to_complete">Unable to Complete</option>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleClose();
              fetchTasks();
            }}
            variant="contained"
            color="primary"
          >
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>
      <TaskCreateDialog open={taskDialogOpen} setOpen={setTaskDialogOpen} />
    </>
  );
}

// Styled components are kept as provided in the question snippet for consistency.
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
