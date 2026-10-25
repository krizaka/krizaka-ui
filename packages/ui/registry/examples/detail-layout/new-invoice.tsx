import { Button } from "@krizaka/ui/button";
import { DetailLayout, FormSteps, FormTotals } from "@krizaka/ui/detail-layout";
import { Field, Input } from "@krizaka/ui/field";
import { Stat } from "@krizaka/ui/stat";
import { StickyAction } from "@krizaka/ui/sticky-action";

// TEMPLATE — a new invoice (Atelier Eric, fictitious): numbered steps in the main column, the totals sticky beside them, the plain
// primary at `lg` (no gradient) in the StickyAction in task mode, which keeps the total and the action in view on every width. No tax or receipt logic here: the product's.
export default function DetailLayoutNewInvoice() {
  return (
    <div className="brand-akinaza w-full">
      <DetailLayout
        back={<a href="#clients">← Gagnon & fils</a>}
        title="New invoice"
        aside={
          <FormTotals>
            <Stat label="Total" value="$640.00" hint="2 lines" />
          </FormTotals>
        }
      >
        <FormSteps
          steps={[
            { id: "client", title: "Client", children: <Field.Root><Field.Label htmlFor="client">Client</Field.Label><Input id="client" defaultValue="Gagnon & fils" /></Field.Root> },
            { id: "lines", title: "What you did", children: <Field.Root><Field.Label htmlFor="description">Description</Field.Label><Input id="description" defaultValue="Tap replacement, 2 hours" /></Field.Root> },
            { id: "terms", title: "Terms", children: <Field.Root><Field.Label htmlFor="due">Due in (days)</Field.Label><Input id="due" defaultValue="30" /></Field.Root> },
          ]}
        />
        <StickyAction mode="task" summary="Total $640.00">
          <Button variant="primary" size="lg">Send the invoice</Button>
        </StickyAction>
      </DetailLayout>
    </div>
  );
}
