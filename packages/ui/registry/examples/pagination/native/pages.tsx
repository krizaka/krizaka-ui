import { Pagination } from "@krizaka/ui/native";
import * as React from "react";

export default function NativePaginationPages() {
  const [page, setPage] = React.useState(3);
  return (
    <Pagination
      page={page}
      pageCount={12}
      onPageChange={setPage}
      labels={{ previous: "Previous page", next: "Next page", compact: (p, count) => `Page ${p} of ${count}` }}
    />
  );
}
