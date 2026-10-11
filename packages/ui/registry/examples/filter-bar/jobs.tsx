"use client";

import { FilterBar, FilterMenu } from "@krizaka/ui/filter-bar";
import { SearchField } from "@krizaka/ui/search-field";
import * as React from "react";

const STATUS = [
  { value: "running", label: "Running", count: 3 },
  { value: "done", label: "Done", count: 128 },
  { value: "failed", label: "Failed", count: 6 },
];
const MODELS = [
  { value: "", label: "All models" },
  { value: "flux", label: "Flux 1.1" },
  { value: "whisper", label: "Whisper large" },
];

// Several criteria at once; each one in force is a chip that undoes it.
export default function FilterBarJobs() {
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState(["failed"]);
  const [model, setModel] = React.useState("flux");
  const active = [
    ...status.map((s) => ({ id: `status:${s}`, label: `Status: ${STATUS.find((o) => o.value === s)?.label}`, onRemove: () => setStatus(status.filter((x) => x !== s)) })),
    ...(model ? [{ id: "model", label: `Model: ${MODELS.find((m) => m.value === model)?.label}`, onRemove: () => setModel("") }] : []),
  ];
  return (
    <FilterBar label="Filter jobs" active={active} onClearAll={() => {
        setStatus([]);
        setModel("");
      }} results="6 jobs">
      <SearchField label="Search jobs" placeholder="Search jobs" value={query} onValueChange={setQuery} landmark={false} className="sm:max-w-64" />
      <FilterMenu label="Status" options={STATUS} value={status} onValueChange={setStatus} />
      <FilterMenu label="Model" multiple={false} options={MODELS} value={model} onValueChange={setModel} />
    </FilterBar>
  );
}
