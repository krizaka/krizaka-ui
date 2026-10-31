import { Badge } from "@krizaka/ui/badge";
import { IdentityCard } from "@krizaka/ui/identity-card";
import { vCard } from "@krizaka/ui/qr-code";

// A fictional business: the mark, the names, a status and the registration number as chips, and the contact as a QR code.
export default function IdentityCardBasic() {
  return (
    <IdentityCard
      mark={<span className="grid h-16 w-16 place-items-center rounded-lg bg-accent font-display text-2xl font-bold text-on-accent">C</span>}
      eyebrow="Business card"
      name="9999-9999 Québec inc."
      subtitle="Salon Cèdre & Ciseaux · Incorporated"
      chips={
        <>
          <Badge size="md" tone="success" dot>Active</Badge>
          <Badge size="md" tone="accent" className="font-mono">NEQ 0000000000</Badge>
          <Badge size="md" tone="neutral">Montréal</Badge>
        </>
      }
      qr={{
        value: vCard({ name: "Salon Cèdre & Ciseaux", organization: "9999-9999 Québec inc.", address: { city: "Montréal", region: "QC", country: "Canada" }, email: "bonjour@example.test", phone: "514-555-0100" }),
        label: "Contact card: scan to add the business to your phone",
        lead: "Scan to add the contact",
        copyLabel: "Copy the vCard",
        copiedLabel: "Copied",
      }}
    />
  );
}
