import { Wall } from "@krizaka/ui/wall";

export default function ZelligeExample() {
  return <Wall aria-label="Zellige wall" texture="zellige" items={[
    { id: "note", kind: "note", x: 50, y: 50, rotation: 3, z: 1, text: "A little sunshine, all year.", signature: "Nour", attachment: "pin" },
  ]} height={360} />;
}
