import { Pagination as MUIPagination, PaginationItem } from "@mui/material";
import Link from "next/link";
import { useStaffContext } from "@/context/StaffContext";

export default function Pagination() {
  const { filter, totalPages } = useStaffContext();
  return (
    <MUIPagination
      sx={{
        marginTop: 2,
      }}
      count={totalPages || 1}
      page={filter.page}
      variant="outlined"
      shape="rounded"
      renderItem={(item) => <PaginationItem component={Link} href={`/dashboard?page=${item.page}`} {...item} />}
    />
  );
}
