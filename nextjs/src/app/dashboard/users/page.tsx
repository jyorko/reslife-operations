"use client";
import SearchCard from "@/components/dashboard/SearchCard";
import Pagination from "@/components/dashboard/Pagination";
import StaffCards from "@/components/dashboard/StaffCards";

export default function Users() {
  return (
    <>
      <SearchCard canAddStaff={true} />
      <StaffCards />
      <Pagination />
    </>
  );
}
