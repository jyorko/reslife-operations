"use client";
import React from "react";
import { Skeleton } from "@mui/material";
import { Card, CardContent, Box, Grid } from "@mui/material";

const TaskCardSkeleton = () => {
  return (
    <Card elevation={0} sx={{ border: "1px solid #999999", width: "100%", my: 1 }}>
      <CardContent sx={{ width: "100%", display: "flex", flexDirection: "row", alignItems: "center" }}>
        <Box sx={{ "& .MuiTypography-body1": { fontWeight: "bold", color: "#999999" } }}>
          <Skeleton width={100} height={24} />
          <Grid container spacing={1}>
            <Grid item xs={3}>
              <Skeleton width={60} height={16} />
            </Grid>
            <Grid item xs={9}>
              <Skeleton width={200} height={16} />
            </Grid>
            <Grid item xs={3}>
              <Skeleton width={60} height={16} />
            </Grid>
            <Grid item xs={9}>
              <Skeleton width={200} height={16} />
            </Grid>
            <Grid item xs={3}>
              <Skeleton width={60} height={16} />
            </Grid>
            <Grid item xs={9}>
              <Skeleton width={200} height={16} />
            </Grid>
            <Grid item xs={3}>
              <Skeleton width={60} height={16} />
            </Grid>
            <Grid item xs={9}>
              <Skeleton width={200} height={16} />
            </Grid>
            <Grid item xs={3}>
              <Skeleton width={60} height={16} />
            </Grid>
            <Grid item xs={9}>
              <Skeleton width={200} height={16} />
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, ml: 2 }}>
          <Skeleton variant="rectangular" width={120} height={36} />
          <Skeleton variant="rectangular" width={120} height={36} />
        </Box>
      </CardContent>
      <Skeleton variant="rectangular" height={21} />
    </Card>
  );
};

export default TaskCardSkeleton;
