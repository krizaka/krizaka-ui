import { Badge, DataTable, type DataTableSort } from "@krizaka/ui/native";
import { useState } from "react";
import { View } from "react-native";

type Job = { id: string; name: string; status: "done" | "running" | "failed"; credits: number; started: string };
const JOBS: Job[] = [
  { id: "j1", name: "Dub “Sunset session”", status: "running", credits: 120, started: "14:02" },
  { id: "j2", name: "Transcribe interview", status: "done", credits: 18, started: "13:40" },
  { id: "j3", name: "Clip the highlights", status: "failed", credits: 0, started: "12:15" },
];
const TONE = { done: "success", running: "accent", failed: "danger" } as const;

// The web DataTable's columns, read as cards: the title column heads each card.
export default function NativeDataTableJobs() {
  const [sort, setSort] = useState<DataTableSort>(null);
  return (
    <View style={{ width: 340 }}>
      <DataTable
        caption="Jobs"
        rows={JOBS}
        getRowId={(j) => j.id}
        sort={sort}
        onSortChange={setSort}
        sortLabel="Sort by"
        columns={[
          { id: "name", header: "Job", card: "title", sortable: true },
          { id: "status", header: "Status", cell: (j) => <Badge tone={TONE[j.status]}>{j.status}</Badge> },
          { id: "credits", header: "Credits", sortable: true },
          { id: "started", header: "Started" },
        ]}
      />
    </View>
  );
}
