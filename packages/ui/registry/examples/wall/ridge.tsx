import { Wall } from "@krizaka/ui/wall";

import { messages } from "./messages";

export default function RidgeExample() {
  const m = messages.en;
  return <Wall aria-label={m.ridgeLabel} texture="ridge" items={[
    { id: "note", kind: "note", x: 50, y: 50, rotation: -3, z: 1, text: m.mountainNote, signature: m.mountainSignature },
  ]} height={360} />;
}
