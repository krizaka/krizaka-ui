import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Skeleton",
  summary:
    "A placeholder the shape of what is loading — lines, circles, blocks, or the real component turned into its own skeleton (`SkeletonShape`) — crossed by one reflection of the brand light.",
  status: "stable",
  category: "feedback",
  domain: "foundations",
  platforms: "both",
  parity: { desktop: "web" },
  whenToUse: ["While a list, a card or a profile loads, in its final layout: the page does not jump when it arrives."],
  whenNotToUse: [
    { when: "For an action the user is waiting on (a save).", use: "spinner" },
    { when: "When there is nothing to load.", use: "empty-state" },
    { when: "For the progress of a task.", use: "progress" },
  ],
  bestPractices: [
    "Best: `SkeletonShape` around the real component with placeholder words — its exact layout, nothing to keep in sync.",
    "Otherwise compose the shapes like the content: an avatar circle, two lines (`SkeletonText`), a media block.",
    "Let `LoadingRegion` (`@krizaka/ui/loader`) decide when to show them: after a short delay, with words when the wait lasts.",
    "Show skeletons only after a short delay on fast connections, and never for more than a few seconds without a message.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "Decorative and hidden from assistive technology: announce the wait elsewhere (`aria-busy` on the region, a `Spinner`).",
      "`SkeletonShape` is also `inert`: the placeholder component can hold no focus.",
      "The reflection stops under `prefers-reduced-motion`: the shapes rest, tinted.",
    ],
  },
  related: ["loader", "spinner", "empty-state", "card"],
  web: {
    imports: ["Skeleton", "SkeletonText", "SkeletonShape"],
    examples: [
      { name: "shape-of-content", title: "The shape of the content", description: "`SkeletonShape` around the real card with placeholder words, above the loaded card: the same layout." },
      { name: "paragraph", title: "A paragraph", description: "A title and `SkeletonText`: lines that wrap, one reflection across them all." },
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
