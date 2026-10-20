import { SpecimenTag } from "@krizaka/ui/specimen-tag";

// A product labelled like a specimen: the catalogue number, the stamp for its honest status, a sentence and its record.
export default function SpecimenTagProduct() {
  return (
    <SpecimenTag
      className="max-w-sm"
      code="KZ-02"
      title="Yomizaka"
      status={{ label: "in development", tone: "wip" }}
      fields={[
        { label: "reads", value: "leases, contracts, invoices" },
        { label: "on Orazaka", value: "document checks" },
      ]}
      footer={
        <>
          <a href="https://dev.yomizaka.com">dev.yomizaka.com ↗</a>
          <a href="https://github.com/krizaka/yomizaka">source</a>
        </>
      }
    >
      <p>Leases, contracts and invoices, read and checked. Every finding quotes its passage.</p>
    </SpecimenTag>
  );
}
