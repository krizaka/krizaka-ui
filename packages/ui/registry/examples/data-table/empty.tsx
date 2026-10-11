import { Button } from "@krizaka/ui/button";
import { DataTable } from "@krizaka/ui/data-table";
import { EmptyState } from "@krizaka/ui/empty-state";

const columns = [
  { id: "invoice", header: "Invoice", card: "title" as const },
  { id: "amount", header: "Amount", align: "end" as const },
];

// No record yet: say what to do next.
export default function DataTableEmpty() {
  return (
    <DataTable
      caption="Invoices"
      rows={[]}
      columns={columns}
      getRowId={() => ""}
      empty={<EmptyState title="No invoice yet" description="Your first invoice appears after your first payout." action={<Button size="sm">Set up payouts</Button>} />}
    />
  );
}
