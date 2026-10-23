import { Wall } from "@krizaka/ui/wall";

export default function ZelligeExample() {
  const m = { zelligeLabel: "Zellige wall", sunnyNote: "A little sunshine, all year.", sunnySignature: "Nour" };
  return <Wall aria-label={m.zelligeLabel} texture="zellige" items={[
    { id: "note", kind: "note", x: 50, y: 50, rotation: 3, z: 1, text: m.sunnyNote, signature: m.sunnySignature, attachment: "pin" },
  ]} height={360} />;
}
