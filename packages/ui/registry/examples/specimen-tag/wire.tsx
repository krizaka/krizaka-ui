import { SpecimenTag } from "@krizaka/ui/specimen-tag";

// `mount="hang"`: tags hung on one wire — the products that run on one engine. Each stamp is the truth of its status.
const tags = [
  { code: "KZ-03", title: "Orochia", status: { label: "dev preview", tone: "ok" as const }, text: "An open-source video platform: upload, encode and stream." },
  { code: "KZ-05", title: "Akinaza", status: { label: "in development", tone: "wip" as const }, text: "The all-in-one for independent Québec shops." },
  { code: "KZ-07", title: "Yororis", status: { label: "in construction", tone: "construction" as const }, text: "A listening space with a face and a voice." },
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
