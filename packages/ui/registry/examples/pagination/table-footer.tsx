"use client";

import { Pagination } from "@krizaka/ui/pagination";
import * as React from "react";

// Under an admin table: rows per page, the range shown, the pages.
export default function PaginationTableFooter() {
  const [page, setPage] = React.useState(1);
  const [size, setSize] = React.useState(20);
  const total = 1284;
  const count = Math.ceil(total / size);
  const first = (page - 1) * size + 1;
  return (
    <Pagination
      page={page}
      pageCount={count}
      onPageChange={setPage}
      pageSize={size}
      pageSizeOptions={[10, 20, 50]}
      onPageSizeChange={(next) => {
        setSize(next);
        setPage(1);
      }}
      status={`${first.toLocaleString("en")}–${Math.min(first + size - 1, total).toLocaleString("en")} of ${total.toLocaleString("en")}`}
    />
  );
}
