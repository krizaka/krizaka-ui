import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Kbd",
  summary: "A key or a keyboard shortcut, set as keys: one `Kbd` per key.",
  status: "stable",
  category: "data-display",
  platforms: "web",
  whenToUse: [
    "To show a shortcut next to the action it runs: a menu item, a palette, a tooltip.",
    "In help text: “Press Esc to close”.",
  ],
  whenNotToUse: [
    { when: "For code or a value the user types: use `<code>`." },
    { when: "For a status or a count.", use: "badge" },
  ],
  bestPractices: [
    "One `Kbd` per key: `<Kbd>⌘</Kbd><Kbd>K</Kbd>`, not `<Kbd>⌘K</Kbd>`.",
    "Show the platform's modifier (⌘ on Apple, Ctrl elsewhere) when you know it.",
  ],
  accessibility: {
    keyboard: [],
    notes: ["A `<kbd>` element: read as text. Spell out symbols a screen reader may skip (“Command K”) in the surrounding text when it matters."],
  },
  related: ["command", "tooltip", "dropdown-menu"],
  web: {
    imports: ["Kbd"],
    examples: [
      { name: "key", title: "Key", description: "A single key." },
      { name: "small", title: "Small", description: "`size=\"sm\"`, in menus and footers." },
      { name: "shortcut", title: "Shortcut", description: "A shortcut in a sentence." },
    ],
  },
} satisfies ComponentMeta;
