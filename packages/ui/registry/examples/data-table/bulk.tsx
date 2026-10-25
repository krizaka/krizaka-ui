"use client";

import { Button } from "@krizaka/ui/button";
import { TagChip } from "@krizaka/ui/chip";
import { DataTable, type DataTableColumn } from "@krizaka/ui/data-table";
import * as React from "react";

type Client = { id: string; name: string; bike: string; tag: "blue" | "amber" | "violet" };
const clients: Client[] = [
  { id: "c1", name: "Eric Tremblay", bike: "Gravel · yearly service", tag: "blue" },
  { id: "c2", name: "Demo client", bike: "City bike · new tyres", tag: "amber" },
  { id: "c3", name: "Sample client", bike: "Cargo bike · brakes", tag: "violet" },
];
const names = { blue: "Regular", amber: "To follow up", violet: "Gift cards" };
const columns: DataTableColumn<Client>[] = [
  { id: "name", header: "Client", type: "title", subtitle: (c) => c.bike },
  { id: "tag", header: "Tag", cell: (c) => <TagChip marker={c.tag}>{names[c.tag]}</TagChip> },
];

// Choose rows: the bar shows the count and the actions the product gives, « Clear selection », and what the last change did.
export default function DataTableBulk() {
  const [result, setResult] = React.useState("");
  return (
    <DataTable
      caption="Clients" rows={clients} columns={columns} getRowId={(c) => c.id} rowLabel={(c) => c.name} selectable defaultSelected={["c1", "c2"]} bulkMax={200} bulkResult={result}
      bulkActions={({ selected, clear }) => (
        <>
          <Button size="sm" variant="secondary" onClick={() => setResult(`${selected.length} tagged`)}>Add a tag</Button>
          <Button size="sm" variant="secondary" onClick={() => { setResult(`${selected.length} moved, 1 skipped`); clear(); }}>Move status</Button>
        </>
      )}
    />
  );
}
