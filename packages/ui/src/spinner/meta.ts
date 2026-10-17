import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Spinner",
  summary: "The Krizaka spinner: light traced around a hexagon, its node breathing — indeterminate, or growing to a `value`; still and legible under reduced motion.",
  status: "stable",
  category: "feedback",
  platforms: "both",
  parity: { desktop: "web" },
  whenToUse: ["For a short wait of unknown length: a search, a refresh, an infinite list loading more."],
  whenNotToUse: [
    { when: "When the layout of what is loading is known.", use: "skeleton" },
    { when: "When the progress is known and the wait is long: a bar says how far.", use: "progress" },
    { when: "When the wait may be instant (it would flash), or ends with a result to announce.", use: "loader" },
    { when: "Inside a button that runs an action: set `loading` on the button.", use: "button" },
  ],
  bestPractices: [
    "One spinner per region: never a page full of them.",
    "Pass `label` translated (“Loading”, “Searching”) and, when you know it, `value`: a growing trace reassures more than a loop.",
    "A wait that may be instant, that ends in success or failure, or that can last: use `Loader`, which waits before showing itself and hands over to a skeleton.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "`role=\"status\"` named by `label`: announced politely.",
      "Under `prefers-reduced-motion` it rests on a designed still frame: a third of the hexagon traced and the node lit — never a frozen blur.",
    ],
  },
  related: ["loader", "skeleton", "progress", "button"],
  web: {
    imports: ["Spinner", "LoaderGlyph"],
    examples: [
      { name: "default", title: "Searching in place", description: "A short wait beside its words: the light travels, the node breathes." },
      { name: "value", title: "A determinate wait", description: "`value` from 0 to 1: the trace grows to what is done, in the same footprint." },
      { name: "sizes", title: "Sizes and colour", description: "The minimal API: `size` sm · md · lg; the colour is `currentColor`." },
    ],
  },
  native: {
    imports: ["Spinner"],
    differences: ["The platform's `ActivityIndicator`, in the accent."],
    examples: [{ name: "sizes", title: "Sizes", description: "`sm`, `md`, `lg`, named by `label`." }],
  },
} satisfies ComponentMeta;
