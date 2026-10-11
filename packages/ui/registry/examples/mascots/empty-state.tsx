import { Button } from "@krizaka/ui/button";
import { EmptyState } from "@krizaka/ui/empty-state";
import { Mascot } from "@krizaka/ui/mascots";

// The owl reads documents: it waits above an empty list; the words and the action say what to do.
export default function MascotEmptyState() {
  return (
    <div className="flex w-96 flex-col items-center">
      <Mascot bird="owl" mood="empty" size={112} />
      <EmptyState
        className="border-none pt-2"
        title="No documents checked yet"
        description="Drop a contract or an invoice: every finding comes with the passage it rests on."
        action={<Button variant="primary">Check a document</Button>}
      />
    </div>
  );
}
