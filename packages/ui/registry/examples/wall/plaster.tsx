import { Wall } from "@krizaka/ui/wall";

import { messages } from "./messages";

export default function PlasterExample() {
  const m = messages.en;
  return <Wall aria-label={m.plasterLabel} texture="plaster" items={[
    { id: "note", kind: "note", x: 50, y: 50, rotation: 2, z: 1, text: m.welcomeNote, signature: m.welcomeSignature },
  ]} height={360} />;
}
