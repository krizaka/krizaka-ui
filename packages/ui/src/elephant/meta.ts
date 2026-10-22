import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Elephant",
  summary:
    "A small, playful elephant mark — « the elephant with those ears can fly »: standing with its ear folded down, or flying with the ear spread like a wing. Sage body, sand ear, flat colours that read on both themes. A figure of the neighbour (Yororis), not a product logo.",
  status: "beta",
  category: "feedback",
  platforms: "web",
  parity: {
    native: { status: "n/a", reason: "A web mark for a page's hero or a chat's closing line; the app takes the same drawing from the mark assets until an app screen needs it.", use: "mascots" },
    desktop: "web",
  },
  whenToUse: [
    "In the hero of a neighbourly page, small, beside the words (`pose=\"standing\"`).",
    "At the closing of a conversation, as a warm last line (`pose=\"flying\"`).",
  ],
  whenNotToUse: [
    { when: "A product's own mark in a navigation or a header.", use: "mascots" },
    { when: "A bird that answers a state (a wait, an error, an empty list).", use: "mascot-state" },
  ],
  bestPractices: [
    "Use it small and rarely: once per screen at most, never as a pattern or a background.",
    "Keep the words beside it: the elephant never carries the message alone.",
    "Standing is the default; flying is for a moment that lifts (a goodbye, a good news).",
    "Leave the colours as they are: the sage and the sand are the Yororis mark's two stops, each readable on both themes.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "Decorative by default (`aria-hidden`): the text next to it carries the meaning. With `title` it becomes an image with that name.",
      "The wing flap stops under `prefers-reduced-motion` and with `animated={false}`.",
      "Sage and sand reach at least 3:1 on the page surfaces of both themes (tested).",
    ],
  },
  related: ["mascots", "mascot-state", "empty-state"],
  web: {
    imports: ["Elephant"],
    examples: [
      { name: "poses", title: "Standing and flying", description: "The two poses: the ear folded down, then spread like a wing." },
      { name: "closing", title: "The closing of a chat", description: "The small flying elephant beside one warm line." },
    ],
  },
} satisfies ComponentMeta;
