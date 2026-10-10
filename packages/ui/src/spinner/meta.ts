import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Spinner",
  summary: "An indeterminate wait: a turning ring named by `label`.",
  status: "stable",
  category: "feedback",
  platforms: "both",
  whenToUse: ["For a short wait of unknown length: a search, a refresh, an infinite list loading more."],
  whenNotToUse: [
    { when: "When the layout of what is loading is known.", use: "skeleton" },
    { when: "When the progress is known.", use: "progress" },
    { when: "Inside a button that runs an action: set `loading` on the button.", use: "button" },
  ],
  bestPractices: ["One spinner per region: never a page full of them.", "Pass `label` translated (“Loading”, “Searching”)."],
  accessibility: {
    keyboard: [],
    notes: ["`role=\"status\"` named by `label`: announced politely.", "It stops turning under `prefers-reduced-motion`."],
  },
  related: ["skeleton", "progress", "button"],
  web: {
    imports: ["Spinner"],
    examples: [
      { name: "default", title: "Default", description: "Named by `label`." },
      { name: "sizes", title: "Sizes", description: "`sm`, `md`, `lg`." },
      { name: "muted", title: "Muted", description: "The colour follows `className`." },
    ],
  },
  native: {
    imports: ["Spinner"],
    differences: ["The platform's `ActivityIndicator`, in the accent."],
    examples: [{ name: "sizes", title: "Sizes", description: "`sm`, `md`, `lg`, named by `label`." }],
  },
} satisfies ComponentMeta;
