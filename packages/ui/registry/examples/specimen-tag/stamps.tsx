import { Stamp } from "@krizaka/ui/specimen-tag";

// The stamp alone, in its four inks: released, in development, not open yet, a plain fact.
export default function SpecimenTagStamps() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Stamp tone="ok">dev preview</Stamp>
      <Stamp tone="wip">in development</Stamp>
      <Stamp tone="construction">in construction</Stamp>
      <Stamp>stable</Stamp>
    </div>
  );
}
