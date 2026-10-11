import { DataTable } from "@krizaka/ui/data-table";

const columns = [
  { id: "user", header: "User", card: "title" as const },
  { id: "role", header: "Role" },
  { id: "joined", header: "Joined", align: "end" as const },
];

// The first page is on its way: skeleton rows, the table busy for screen readers.
export default function DataTableLoading() {
  return <DataTable caption="Users" rows={[]} columns={columns} getRowId={() => ""} loading loadingRows={4} />;
}
