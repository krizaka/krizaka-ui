"use client";

import { Pagination } from "@krizaka/ui/pagination";
import * as React from "react";

// The explore page of a video platform: 392 results, 20 per page.
export default function PaginationResults() {
  const [page, setPage] = React.useState(4);
  const first = (page - 1) * 20 + 1;
  return (
    <Pagination
      page={page}
      pageCount={20}
      onPageChange={setPage}
      status={`${first}–${Math.min(first + 19, 392)} of 392 videos`}
      labels={{ nav: "Pages of results" }}
    />
  );
}
