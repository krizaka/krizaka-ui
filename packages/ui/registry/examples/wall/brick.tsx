import { Wall } from "@krizaka/ui/wall";

export default function BrickExample() {
  const m = { brickLabel: "Brick wall", paintedSign: "The neighbourhood" };
  return <Wall aria-label={m.brickLabel} texture="brick" items={[
    { id: "sign", kind: "sign", x: 50, y: 50, rotation: -2, z: 1, logo: m.paintedSign, variant: "painted" },
  ]} height={360} />;
}
