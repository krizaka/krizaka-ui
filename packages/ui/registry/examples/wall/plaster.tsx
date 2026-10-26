import { Wall } from "@krizaka/ui/wall";

export default function PlasterExample() {
  const m = { plasterLabel: "Plaster wall", welcomeNote: "Come as you are. There is always room.", welcomeSignature: "Alex" };
  return <Wall aria-label={m.plasterLabel} texture="plaster" items={[
    { id: "note", kind: "note", x: 50, y: 50, rotation: 2, z: 1, text: m.welcomeNote, signature: m.welcomeSignature },
  ]} />;
}
