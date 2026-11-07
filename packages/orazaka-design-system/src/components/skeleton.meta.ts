import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Skeleton",
  summary:
    "The @krizaka/ui skeleton (default shape `rect`) with the 1.x shorthands, and `SkeletonGroup` — a paragraph of text lines.",
  why: "Orazaka 1.x sized skeletons with `width` / `height` and chose the shape with `variant`; this adapter keeps them (deprecated) on the primitive, and adds `SkeletonGroup`, the paragraph its chat and document views wait on.",
  status: "stable",
  category: "feedback",
  platforms: "web",
  builtOn: ["ui/skeleton"],
  whenToUse: [
    "While an answer, a document or a list loads: the shape of what is coming.",
    "`SkeletonGroup` for a paragraph (an answer being prepared).",
  ],
  whenNotToUse: [
    {
      when: "In new code for a single block: import `Skeleton` from `@krizaka/ui/skeleton` and size it with `className`.",
      use: "ui/skeleton",
    },
    { when: "For an action in progress (a button, a send).", use: "ui/spinner" },
  ],
  bestPractices: [
    "Size with `className` (`h-4 w-32`), not `width` / `height` (deprecated).",
    "Match the layout that replaces it, so nothing jumps.",
  ],
  accessibility: {
    keyboard: [],
    notes: ["Hidden from assistive technology: announce the loading state elsewhere (`aria-busy` on the region)."],
  },
  related: ["ui/skeleton", "ui/spinner"],
  web: {
    imports: ["Skeleton", "SkeletonGroup"],
    examples: [
      {
        name: "answer-loading",
        title: "An answer loading",
        description: "The avatar and three lines while the engine prepares the answer.",
      },
    ],
  },
} satisfies ComponentMeta;
