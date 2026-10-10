import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Badge",
  summary: "A short status or label: a tone, two sizes, an optional dot that can pulse.",
  status: "stable",
  category: "data-display",
  platforms: "both",
  whenToUse: [
    "To label the state of an item: paid, pending, new, live, ending soon.",
    "On a media (`tone=\"scrim\"`): a duration, a quality, a live marker.",
    "With a `dot` (and `pulse`) for something happening now.",
  ],
  whenNotToUse: [
    { when: "For something the user can click or select.", use: "chip" },
    { when: "For a message the user must read.", use: "alert" },
    { when: "For a key figure with a trend.", use: "stat" },
  ],
  bestPractices: [
    "One or two words: a badge is scanned, not read.",
    "Keep the tone meaningful: `success`, `warning`, `danger` for states; `accent` to highlight; `neutral` otherwise.",
    "`pulse` only for what is live: a page full of pulsing dots says nothing.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "A plain `<span>`: its text is read with the content around it; the dot is decorative.",
      "The colour is never the only signal: the words say the state.",
      "The pulse stops under `prefers-reduced-motion`.",
    ],
  },
  related: ["chip", "stat", "card"],
  web: {
    imports: ["Badge"],
    examples: [
      { name: "neutral", title: "Neutral", description: "The default tone." },
      { name: "accent", title: "Accent", description: "To highlight: new, featured." },
      { name: "success", title: "Success", description: "A good state: paid, verified." },
      { name: "warning", title: "Warning", description: "A state that needs attention soon." },
      { name: "danger", title: "Danger with pulse", description: "Urgent, happening now: the dot pulses." },
      { name: "scrim", title: "On a media", description: "`tone=\"scrim\"`: the veil and the text are identical in both themes." },
      { name: "medium", title: "Medium", description: "`size=\"md\"` for a badge next to a heading." },
    ],
  },
  native: {
    imports: ["Badge"],
    differences: ["The text is set in capitals by the component.", "No `className`: style it with `style`."],
    examples: [
      { name: "tones", title: "Tones", description: "`neutral`, `accent`, `success`, `warning`, `danger`." },
      { name: "dot", title: "Dot", description: "`sm` and `md`, with a pulsing dot." },
      { name: "scrim", title: "On a media", description: "`scrim`: identical in both themes." },
    ],
  },
} satisfies ComponentMeta;
