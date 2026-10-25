import { StatusSetEditor } from "@krizaka/ui/kind-config-editor";

const label = (fr: string, en: string) => ({ fr, en });

// A derived set (an invoice's status comes from the ledger): shown read-only, with no moves to edit.
export default function StatusSetEditorDerived() {
  return (
    <StatusSetEditor
      roles={[]} onChange={() => {}}
      value={{
        key: "invoice", label: label("Facture", "Invoice"), mode: "derived", transitions: [],
        states: [{ key: "sent", label: label("Envoyée", "Sent"), tone: "accent" }, { key: "paid", label: label("Payée", "Paid"), tone: "success" }],
      }}
    />
  );
}
