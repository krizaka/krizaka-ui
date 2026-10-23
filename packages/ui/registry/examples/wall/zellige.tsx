import { Wall } from "@krizaka/ui/wall";

import { messages } from "./messages";

export default function ZelligeExample() {
  const m = messages.en;
  return <Wall aria-label={m.zelligeLabel} texture="zellige" items={[
    { id: "note", kind: "note", x: 50, y: 50, rotation: 3, z: 1, text: m.sunnyNote, signature: m.sunnySignature, attachment: "pin" },
  ]} height={360} />;
}
