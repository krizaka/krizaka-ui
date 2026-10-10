import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Skeleton",
  summary: "A placeholder the shape of what is loading: a line, a circle or a block.",
  status: "stable",
  category: "feedback",
  platforms: "both",
  whenToUse: ["While a list, a card or a profile loads, in its final layout: the page does not jump when it arrives."],
  whenNotToUse: [
    { when: "For an action the user is waiting on (a save).", use: "spinner" },
    { when: "When there is nothing to load.", use: "empty-state" },
    { when: "For the progress of a task.", use: "progress" },
  ],
  bestPractices: [
    "Compose the shapes like the content: an avatar circle, two lines, a media block.",
    "Show skeletons only after a short delay on fast connections, and never for more than a few seconds without a message.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "Decorative and hidden from assistive technology: announce the wait elsewhere (`aria-busy` on the region, a `Spinner`).",
      "The pulse stops under `prefers-reduced-motion`.",
    ],
  },
  related: ["spinner", "empty-state", "card"],
  web: {
    imports: ["Skeleton"],
    examples: [
      { name: "text", title: "Text", description: "A line of text." },
      { name: "circle", title: "Circle", description: "An avatar." },
      { name: "rect", title: "Rect", description: "A media or a block." },
      { name: "composition", title: "Composition", description: "Shapes composed into a card being loaded." },
    ],
  },
  native: {
    imports: ["Skeleton"],
    differences: ["`width` and `height` are props (points or a percentage), not classes."],
    examples: [{ name: "shapes", title: "Shapes", description: "`text`, `circle` and `rect`, composed." }],
  },
} satisfies ComponentMeta;
