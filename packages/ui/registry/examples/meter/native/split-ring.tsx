import { Meter, Txt } from "@krizaka/ui/native";

// Where a $10 tip goes: a ring split into parts, with its legend.
export default function NativeMeterSplitRing() {
  return (
    <Meter
      label="Split of a tip"
      variant="ring"
      max={1000}
      parts={[
        { label: "To the creator", value: 850, valueText: "$8.50" },
        { label: "Platform", value: 100, valueText: "$1.00" },
        { label: "Payment fees", value: 50, valueText: "$0.50" },
      ]}
    >
      <Txt variant="title">$10</Txt>
    </Meter>
  );
}
