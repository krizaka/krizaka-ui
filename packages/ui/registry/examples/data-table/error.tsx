"use client";

import { Button } from "@krizaka/ui/button";
import { DataTable } from "@krizaka/ui/data-table";

const columns = [
  { id: "event", header: "Event", card: "title" as const },
  { id: "at", header: "At", align: "end" as const },
];

// The request failed: what happened, and a way to try again — announced, in place of the rows.
export default function DataTableError() {
  return (
    <DataTable
      caption="Audit log"
      rows={[]}
      columns={columns}
      getRowId={() => ""}
      error={
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm text-fg">The audit log could not be loaded.</p>
          <Button size="sm" variant="outline" onClick={() => window.location.reload()}>
            Try again
          </Button>
        </div>
      }
    />
  );
}
