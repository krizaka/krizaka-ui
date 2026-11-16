import { SketchPair, type SketchSpec } from "@krizaka/ui/sketch";

// A redesign before and after: three buttons of the same weight become one primary action and a link.
const card = (buttons: SketchSpec["shapes"]): SketchSpec => ({
  width: 480, height: 300, frame: "desktop", seed: 5,
  shapes: [{ kind: "text", x: 32, y: 52, text: "Plan", size: "md" }, { kind: "lines", x: 32, y: 90, w: 400, count: 3 }, ...buttons],
});
const before = card([
  { kind: "button", x: 32, y: 200, w: 130, h: 48, variant: "secondary", label: "Save" },
  { kind: "button", x: 175, y: 200, w: 130, h: 48, variant: "secondary", label: "Send" },
  { kind: "button", x: 318, y: 200, w: 130, h: 48, variant: "secondary", label: "Pay" },
]);
const after = card([
  { kind: "button", x: 32, y: 200, w: 200, h: 48, variant: "primary", label: "Pay" },
  { kind: "text", x: 260, y: 230, text: "save", size: "sm" },
]);

export default function SketchBeforeAfter() {
  return (
    <SketchPair
      beforeLabel="before"
      afterLabel="after"
      before={{ title: "Before: three buttons of the same weight", spec: { ...before, callouts: [{ n: 1, at: [240, 250], from: [240, 290] }] }, legend: [{ n: 1, label: "Three equals", text: "the eye does not know where to go." }] }}
      after={{ title: "After: one primary action and a link", spec: { ...after, callouts: [{ n: 1, at: [132, 250], from: [132, 290] }] }, legend: [{ n: 1, label: "One action", text: "Pay is the page's goal; saving becomes a link." }] }}
    />
  );
}
