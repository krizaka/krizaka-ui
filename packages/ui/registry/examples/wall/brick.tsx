import { Wall } from "@krizaka/ui/wall";

export default function BrickExample() {
  return <Wall aria-label="Brick wall" texture="brick" items={[
    { id: "sign", kind: "sign", x: 50, y: 50, rotation: -2, z: 1, logo: "Le quartier", variant: "painted" },
  ]} height={360} />;
}
