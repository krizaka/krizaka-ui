import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Tag selector",
  summary: "Interests, languages, what one is looking for: toggle chips with a limit and a count — the others rest once the limit is reached.",
  status: "beta",
  category: "forms",
  platforms: "both",
  parity: { desktop: "web" },
  whenToUse: ["A profile's interests, up to five.", "Filters by topic with a limit."],
  whenNotToUse: [
    { when: "To type free tags.", use: "tag-input" },
    { when: "For one choice.", use: "radio-group" },
  ],
  bestPractices: ["Say the limit in the count (“3 of 5 chosen”).", "Order the options by popularity, not alphabet."],
  accessibility: {
    keyboard: [{ keys: "Tab / Space", action: "Reach and toggle each chip." }],
    notes: ["A group named by `label`; each chip says whether it is chosen; the count is announced."],
  },
  related: ["chip", "tag-input", "filter-bar"],
  web: {
    imports: ["TagSelector"],
    examples: [
      { name: "interests", title: "Interests", description: "Ten interests, up to five." },
    ],
  },
  native: {
    imports: ["TagSelector"],
    differences: ["A selection tick on each toggle."],
    examples: [
      { name: "interests", title: "Interests", description: "Ten interests, up to five." },
    ],
  },
} satisfies ComponentMeta;
