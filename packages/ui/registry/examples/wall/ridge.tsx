import { Wall } from "@krizaka/ui/wall";

export default function RidgeExample() {
  const m = { ridgeLabel: "Mountain wall", mountainNote: "Back after a walk in the mountains.", mountainSignature: "Lou" };
  return <Wall aria-label={m.ridgeLabel} texture="ridge" items={[
    { id: "note", kind: "note", x: 50, y: 50, rotation: -3, z: -2, text: m.mountainNote, signature: m.mountainSignature },
  ]} height={360} />;
}
