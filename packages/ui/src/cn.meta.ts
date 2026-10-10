import type { ComponentMeta } from "./meta";

export const meta = {
  title: "cn",
  summary: "Joins class names and resolves Tailwind conflicts: the last class wins.",
  status: "stable",
  category: "foundations",
  platforms: "web",
  whenToUse: ["To build a `className` from conditions in a product component.", "To let a caller's `className` override a component's classes."],
  whenNotToUse: [
    { when: "To define the variants of a component: use `tv()` from tailwind-variants, like the primitives." },
    { when: "To pass props and classes to a child element.", use: "slot" },
  ],
  bestPractices: ["Put the caller's `className` last: `cn(base, conditional, className)`.", "One `cn` per app: it shares the merge engine of the primitives."],
  accessibility: { keyboard: [], notes: ["No effect on accessibility: it only computes a class string."] },
  related: ["slot", "theme"],
  web: {
    imports: ["cn"],
    examples: [{ name: "merge", title: "Merge", description: "The last class wins: `px-4` replaces `px-3`, the selected colours replace the idle ones." }],
  },
} satisfies ComponentMeta;
