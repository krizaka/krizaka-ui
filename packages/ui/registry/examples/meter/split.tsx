import { Meter, MeterValue } from "@krizaka/ui/meter";

// Where a €10 tip goes: a split drawn as a ring and a bar, each with its legend — the text version of what it draws.
const parts = [
  { label: "To the creator", value: 90, valueText: "€9.00" },
  { label: "Platform", value: 10, valueText: "€1.00" },
];

export default function MeterSplit() {
  return (
    <div className="flex w-full max-w-md flex-wrap items-center gap-8">
      <Meter variant="ring" label="Split of a €10 tip" parts={parts}>
        <MeterValue value="90 %" caption="creator" />
      </Meter>
      <Meter label="Split of a €10 tip" parts={parts} showLabel className="min-w-48 flex-1" />
    </div>
  );
}
