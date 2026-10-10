import type { ComponentMeta } from "../../meta";

export const meta = {
  title: "Segmented",
  summary: "A segmented control that switches between views of a screen — the native counterpart of the web's segmented tabs.",
  status: "beta",
  category: "navigation",
  platforms: "native",
  whenToUse: ["At the top of a screen, to switch between two to four views of the same content: feed, auctions, challenges."],
  whenNotToUse: [
    { when: "To filter a list.", use: "chip" },
    { when: "On the web.", use: "tabs" },
  ],
  bestPractices: ["Controlled: keep `value` in the screen's state (or the route).", "One or two words per segment, passed translated."],
  accessibility: {
    keyboard: [],
    notes: ["A tab list named by `aria-label`; each segment is a tab with its selected state.", "An option with `disabled` is announced as disabled and cannot be pressed."],
  },
  related: ["tabs", "chip"],
  native: {
    imports: ["Segmented"],
    differences: [],
    examples: [
      { name: "default", title: "Default", description: "Controlled, three views." },
      { name: "small", title: "Small", description: "`size=\"sm\"`." },
    ],
  },
} satisfies ComponentMeta;
