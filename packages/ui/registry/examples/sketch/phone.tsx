import { Sketch, type SketchSpec } from "@krizaka/ui/sketch";

// The same page on a phone: the outline of a phone, arrows from the margin to the items.
const spec: SketchSpec = {
  width: 390, height: 780, frame: "phone", seed: 3,
  shapes: [
    { kind: "icon", x: 20, y: 20, name: "menu" },
    { kind: "text", x: 60, y: 38, text: "Atelier", size: "md" },
    { kind: "icon", x: 346, y: 20, name: "search" },
    { kind: "box", x: 20, y: 70, w: 350, h: 220, fill: "accent" },
    { kind: "lines", x: 20, y: 330, w: 330, count: 5 },
    { kind: "box", x: 20, y: 420, w: 350, h: 150, dashed: true },
    { kind: "text", x: 40, y: 460, text: "9:00", size: "sm" },
    { kind: "text", x: 40, y: 490, text: "10:30", size: "sm" },
    { kind: "button", x: 20, y: 690, w: 350, h: 56, variant: "primary", label: "Book" },
  ],
  callouts: [
    { n: 1, at: [32, 32], from: [-50, 60], arrow: true },
    { n: 2, at: [100, 470], from: [-50, 470], arrow: true },
    { n: 3, at: [370, 718], from: [440, 640], arrow: true },
  ],
};

export default function SketchPhone() {
  return (
    <Sketch
      title="The booking page on a phone: the menu, the free times and the booking button"
      spec={spec}
      legend={[
        { n: 1, label: "The menu", text: "the sections behind one button, top left." },
        { n: 2, label: "The free times", text: "the next ones first; a dashed box, they may be empty." },
        { n: 3, label: "Book", text: "within reach of the thumb, at the bottom." },
      ]}
      caption="Fig. 2 — the same page on a phone"
    />
  );
}
