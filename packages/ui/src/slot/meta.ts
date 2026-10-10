import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Slot",
  summary: "`Slot` merges its props and classes into its only child — the engine of `asChild` — and `VisuallyHidden` names things for screen readers only.",
  status: "stable",
  category: "foundations",
  platforms: "web",
  whenToUse: ["To give your own component an `asChild` prop.", "`VisuallyHidden` for words that only assistive technology needs: an icon button's name, a table caption."],
  whenNotToUse: [
    { when: "To style a link like a button: `asChild` on the button does it.", use: "button" },
    { when: "To hide something from everyone: use `hidden`." },
  ],
  bestPractices: ["`Slot` takes exactly one child element.", "Prefer a visible label to `VisuallyHidden` when there is room for one."],
  accessibility: {
    keyboard: [],
    notes: ["`VisuallyHidden` is read by screen readers and not shown.", "`Slot` keeps the child's element: a link stays a link, with its role and keyboard."],
  },
  related: ["button", "cn"],
  web: {
    imports: ["Slot", "VisuallyHidden"],
    examples: [
      { name: "as-child", title: "Slot", description: "The link is rendered, styled by the Slot." },
      { name: "visually-hidden", title: "VisuallyHidden", description: "An icon button named for screen readers." },
    ],
  },
} satisfies ComponentMeta;
