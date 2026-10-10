import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Empty state",
  summary: "What a list, a search or a panel says when it has nothing to show: an icon, a title, a line and an action.",
  status: "stable",
  category: "feedback",
  platforms: "both",
  whenToUse: [
    "When a list is empty for the first time: say what will appear here and how to start.",
    "When a search or a filter returns nothing: say so, and how to widen it.",
  ],
  whenNotToUse: [
    { when: "While the content is loading.", use: "skeleton" },
    { when: "When loading failed: say what went wrong.", use: "alert" },
  ],
  bestPractices: [
    "Title: what is empty, in a few words (“No videos yet”); description: why, or what will fill it.",
    "One action at most, the one that fills the list.",
  ],
  accessibility: {
    keyboard: [],
    notes: ["`role=\"status\"`: announced politely when it appears after a search.", "The icon is decorative and hidden from assistive technology."],
  },
  related: ["skeleton", "alert", "spinner"],
  web: {
    imports: ["EmptyState"],
    examples: [
      { name: "default", title: "Default", description: "An icon, a title and a line." },
      { name: "with-action", title: "With an action", description: "What to do next." },
      { name: "title-only", title: "Title only", description: "A search without result." },
    ],
  },
  native: {
    imports: ["EmptyState"],
    differences: ["The action is a native `Button` (with `label`).", "Style with `style`, not `className`."],
    examples: [{ name: "default", title: "Default", description: "An icon, a header, a line and an action." }],
  },
} satisfies ComponentMeta;
