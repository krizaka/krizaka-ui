import { Wall } from "@krizaka/ui/wall";

export default function RidgeExample() {
  return <Wall aria-label="Mountain wall" texture="ridge" items={[
    { id: "note", kind: "note", x: 50, y: 50, rotation: -3, z: 1, text: "Back after a walk in the mountains.", signature: "Lou" },
  ]} height={360} />;
}
