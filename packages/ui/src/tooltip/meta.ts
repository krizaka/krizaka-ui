import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Tooltip",
  summary: "A short label shown on hover and on keyboard focus, next to its trigger.",
  status: "stable",
  category: "overlays",
  platforms: "web",
  whenToUse: ["To name an icon button for sighted mouse users: copy, share, more.", "To show a shortcut next to an action."],
  whenNotToUse: [
    { when: "For information people need to complete a task: put it in the page.", use: "field" },
    { when: "For interactive content (links, buttons).", use: "popover" },
    { when: "On touch screens as the only label: there is no hover." },
  ],
  bestPractices: [
    "A few words, no punctuation: “Copy the link”.",
    "The trigger keeps its own accessible name (an `IconButton` `label`); the tooltip repeats it for the eye.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Focusing the trigger shows the tooltip at once." },
      { keys: "Esc", action: "Hides it." },
    ],
    notes: ["Radix Tooltip: `role=\"tooltip\"`, linked to the trigger by `aria-describedby`.", "It opens on hover after `delayDuration` (300 ms) and never holds focus."],
  },
  related: ["button", "popover", "kbd"],
  web: {
    imports: ["Tooltip"],
    examples: [
      { name: "top", title: "Top", description: "Above its trigger (the default)." },
      { name: "right", title: "Right", description: "`side=\"right\"`." },
    ],
  },
} satisfies ComponentMeta;
