import React from "react";
import { Card, CardContent, Box, Grid } from "@mui/material";
import { Skeleton } from "@mui/material";

const StaffCardSkeleton = () => {
  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid #999999",
        width: "100%",
        my: 1,
      }}
    >
      <CardContent
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Skeleton variant="rounded" width={80} height={80} />
        <Box
          sx={{
            marginLeft: 2,
            "& .MuiTypography-body1": {
              fontWeight: "bold",
              color: "#999999",
            },
          }}
        >
          <Skeleton width={100} height={24} />
          <Grid container spacing={1}>
            <Grid item xs={3}>
              <Skeleton width={60} height={16} />
            </Grid>
            <Grid item xs={3}>
              <Skeleton width={60} height={16} />
            </Grid>
            <Grid item xs={3}>
              <Skeleton width={60} height={16} />
            </Grid>
            <Grid item xs={3}>
              <Skeleton width={60} height={16} />
            </Grid>
            <Grid item xs={3}>
              <Skeleton width={60} height={16} />
            </Grid>
            <Grid item xs={3}>
              <Skeleton width={60} height={16} />
            </Grid>
            <Grid item xs={3}>
              <Skeleton width={60} height={16} />
            </Grid>
            <Grid item xs={3}>
              <Skeleton width={60} height={16} />
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StaffCardSkeleton;
