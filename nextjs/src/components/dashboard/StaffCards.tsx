import { StaffCardProps } from "./StaffCard";
import StaffCard from "./StaffCard";
import StaffCardSkeleton from "./StaffCardSkeleton";
import { useStaffContext } from "@/context/StaffContext";
import { Box, Typography } from "@mui/material";

type StaffCardsProps = {
  inManagementMode?: boolean;
};

const StaffCards = ({ inManagementMode }: StaffCardsProps) => {
  const { Staff, loading } = useStaffContext();
  return (
    <>
      {loading ? (
        [...Array(10)].map((_, i) => <StaffCardSkeleton key={i} />)
      ) : (
        <>
          {Staff.map((Staff: StaffCardProps) => (
            <StaffCard key={Staff.email} {...Staff} inManagementMode={inManagementMode} />
          ))}
        </>
      )}
      {Staff.length === 0 && !loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexGrow: 1,
            color: "grey.500",
          }}
        >
          <Typography variant="h6" component="div">
            No Staff found.
          </Typography>
        </Box>
      )}
    </>
  );
};

export default StaffCards;
