import { SpecimenTag } from "@krizaka/ui/specimen-tag";

// `mount="hang"`: tags hung on one wire — the products that run on one engine. Each stamp is the truth of its status.
const tags = [
  { code: "KZ-02", title: "Orazaka", status: { label: "dev preview", tone: "ok" as const }, text: "Sovereign AI on your own servers: chat, documents, images and video." },
  { code: "KZ-05", title: "Akinaza", status: { label: "in development", tone: "wip" as const }, text: "The all-in-one for independent Québec shops." },
  { code: "KZ-06", title: "Yomizaka", status: { label: "in development", tone: "wip" as const }, text: "Reads your leases, contracts and invoices." },
];

export default function SpecimenTagWire() {
  return (
    <div className="grid gap-6 border-t-2 border-fg-secondary sm:grid-cols-3">
      {tags.map((t) => (
        <SpecimenTag key={t.code} mount="hang" code={t.code} title={t.title} status={t.status}>
          <p>{t.text}</p>
        </SpecimenTag>
      ))}
    </div>
  );
}
