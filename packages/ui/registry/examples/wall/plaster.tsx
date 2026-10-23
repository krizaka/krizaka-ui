import { Wall } from "@krizaka/ui/wall";

export default function PlasterExample() {
  return <Wall aria-label="Plaster wall" texture="plaster" items={[
    { id: "note", kind: "note", x: 50, y: 50, rotation: 2, z: 1, text: "Come as you are. There is always room.", signature: "Alex" },
  ]} height={360} />;
}
