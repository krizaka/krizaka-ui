import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Popover",
  summary: "A floating panel next to its trigger, for a small form or details, closed by Escape or a click outside.",
  status: "stable",
  category: "overlays",
  platforms: "web",
  whenToUse: ["For a small, optional task next to what it changes: set a goal, pick a filter, edit a name.", "To show details on demand without leaving the page."],
  whenNotToUse: [
    { when: "For a list of actions.", use: "dropdown-menu" },
    { when: "For a short hint on hover or focus.", use: "tooltip" },
    { when: "For a task that must be finished before going on.", use: "dialog" },
  ],
  bestPractices: [
    "Name the content with `aria-label` (or a heading inside) when the trigger's words are not enough.",
    "Keep it small: if it scrolls, it should be a dialog or a page.",
    "Put the close or cancel action in `Popover.Close`.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Enter / Space", action: "Opens the popover from its trigger; the focus moves into it." },
      { keys: "Esc", action: "Closes it and returns the focus to the trigger." },
    ],
    notes: ["Radix Popover: the trigger has `aria-expanded` and `aria-controls`; the content is a `dialog`.", "It is not modal: the page stays reachable."],
  },
  related: ["dropdown-menu", "tooltip", "dialog"],
  web: {
    imports: ["Popover"],
    examples: [{ name: "form", title: "A small form", description: "A field and two buttons next to their trigger." }],
  },
} satisfies ComponentMeta;
