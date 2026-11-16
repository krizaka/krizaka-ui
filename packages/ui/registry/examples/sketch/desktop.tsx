import { Sketch, type SketchSpec } from "@krizaka/ui/sketch";

// A booking page drawn with the pen: the words are in the legend, the drawing keeps only numbers and a few labels.
const spec: SketchSpec = {
  width: 1200, height: 720, frame: "desktop", seed: 7,
  shapes: [
    { kind: "box", x: 0, y: 0, w: 1200, h: 72, fill: "soft" },
    { kind: "icon", x: 40, y: 24, name: "calendar" },
    { kind: "text", x: 80, y: 44, text: "Atelier", size: "md" },
    { kind: "box", x: 60, y: 120, w: 700, h: 300, fill: "accent" },
    { kind: "lines", x: 60, y: 470, w: 640, count: 4 },
    { kind: "box", x: 820, y: 120, w: 320, h: 480 },
    { kind: "lines", x: 850, y: 170, w: 260, count: 3 },
    { kind: "button", x: 850, y: 520, w: 260, h: 52, variant: "primary", label: "Book" },
  ],
  callouts: [
    { n: 1, at: [112, 52], from: [190, 110] },
    { n: 2, at: [400, 270] },
    { n: 3, at: [700, 500], from: [790, 650], arrow: true },
    { n: 4, at: [1060, 576], from: [1060, 660], arrow: true },
  ],
};

export default function SketchDesktop() {
  return (
    <Sketch
      title="A booking page: the shop's name, its photo, its words and the booking panel"
      spec={spec}
      legend={[
        { n: 1, label: "The shop's name", text: "always in the bar: the visitor knows where they are." },
        { n: 2, label: "The photo", text: "one picture of the place, never a slideshow." },
        { n: 3, label: "The words", text: "what the shop does, in four lines at most." },
        { n: 4, label: "Book", text: "the one primary action of the page, beside the hours." },
      ]}
      caption="Fig. 1 — the booking page, drawn"
    />
  );
}
