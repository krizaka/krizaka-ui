import { Badge } from "@krizaka/ui/badge";
import { Button } from "@krizaka/ui/button";
import { DetailLayout, DetailNotes, DetailSection } from "@krizaka/ui/detail-layout";

// TEMPLATE — a client's page (Atelier Eric, fictitious): the profile banner, binder sections in the main column and the notes
// column (numbered notes, an add field) beside it — under the sections on a phone.
export default function DetailLayoutClient() {
  return (
    <div className="brand-akinaza w-full">
      <DetailLayout
        cover
        back={<a href="#clients">← Clients</a>}
        eyebrow="Client"
        title="Gagnon & fils"
        status={<Badge tone="warning">To follow up</Badge>}
        meta="Laval · client since 2024"
        actions={<Button size="sm" variant="primary">New invoice</Button>}
        notes={
          <DetailNotes
            title="Notes"
            emptyLabel="No notes yet."
            notes={[
              { id: "n1", body: "Prefers a call before a visit.", meta: "Eric · Oct 12" },
              { id: "n2", body: "Quote sent for the garage tap.", meta: "Eric · Oct 19" },
            ]}
            add={<Button size="sm" variant="secondary">Add a note</Button>}
          />
        }
      >
        <DetailSection title="Invoices" action={<a href="#all">See all</a>}>
          <p className="m-0 text-sm text-fg-secondary">One invoice is waiting for payment: $640, 9 days late.</p>
        </DetailSection>
        <DetailSection title="Visits">
          <p className="m-0 text-sm text-fg-secondary">Next visit: Thursday at 2:00 PM.</p>
        </DetailSection>
      </DetailLayout>
    </div>
  );
}
