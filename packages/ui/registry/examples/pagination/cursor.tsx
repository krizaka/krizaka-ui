"use client";

import { Pagination } from "@krizaka/ui/pagination";
import * as React from "react";

// An API that answers with a `nextCursor`: no total, previous and next only.
export default function PaginationCursor() {
  const [pages, setPages] = React.useState(["start"]);
  const index = pages.length - 1;
  return (
    <Pagination
      hasPrevious={index > 0}
      hasNext
      onPrevious={() => setPages((p) => p.slice(0, -1))}
      onNext={() => setPages((p) => [...p, `cursor-${p.length}`])}
      status={`Jobs ${index * 25 + 1}–${index * 25 + 25}`}
      labels={{ previous: "Newer jobs", next: "Older jobs" }}
    />
  );
}
