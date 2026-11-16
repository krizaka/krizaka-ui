import { Sketch, type SketchSpec } from "@krizaka/ui/sketch";

// An invoice with the customer's details hatched: a sketch never shows a real name or address.
const spec: SketchSpec = {
  width: 800, height: 520, frame: "desktop", seed: 11,
  shapes: [
    { kind: "text", x: 40, y: 60, text: "Invoice", size: "md" },
    { kind: "hatch", x: 40, y: 90, w: 320, h: 110 },
    { kind: "lines", x: 460, y: 100, w: 280, count: 3 },
    { kind: "line", from: [40, 240], to: [760, 240] },
    { kind: "lines", x: 40, y: 280, w: 560, count: 4 },
    { kind: "text", x: 640, y: 290, text: "$ 120", size: "sm" },
    { kind: "line", from: [460, 400], to: [760, 400] },
    { kind: "text", x: 640, y: 440, text: "$ 138", size: "md" },
  ],
  callouts: [
    { n: 1, at: [200, 145], from: [200, -40], arrow: true },
    { n: 2, at: [668, 448], from: [668, 500] },
  ],
};

export default function SketchHatch() {
  return (
    <Sketch
      title="An invoice: the customer's details are hatched, the total is at the bottom right"
      spec={spec}
      legend={[
        { n: 1, label: "The customer", text: "hatched: personal details never appear in a figure." },
        { n: 2, label: "The total", text: "taxes included, the last line the eye reaches." },
      ]}
    />
  );
}
