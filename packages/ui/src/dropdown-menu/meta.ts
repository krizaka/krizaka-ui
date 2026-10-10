import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Dropdown menu",
  summary: "A menu of actions opened from a trigger: items with icons, checkbox items, labels, separators, a destructive item.",
  status: "stable",
  category: "overlays",
  platforms: "web",
  whenToUse: [
    "For the secondary actions of an item or a page: edit, share, download, delete (a “more” button).",
    "For a few options toggled from a toolbar (`CheckboxItem`).",
  ],
  whenNotToUse: [
    { when: "For the main action of a view: show it as a button.", use: "button" },
    { when: "To search among many commands.", use: "command" },
    { when: "For content that is not a list of actions (a form, details).", use: "popover" },
    { when: "To pick a value in a form: use a select.", use: "field" },
  ],
  bestPractices: [
    "Start each item with a verb; put the destructive one last, after a separator, with `tone=\"danger\"`.",
    "Keep the menu short: more than about seven items is a page or a palette.",
    "An `IconButton` trigger needs a `label` (“More actions”).",
  ],
  accessibility: {
    keyboard: [
      { keys: "Enter / Space / Arrow down", action: "Opens the menu from its trigger." },
      { keys: "Arrow keys / Home / End", action: "Move through the items; typing a letter jumps to an item." },
      { keys: "Esc", action: "Closes the menu and returns the focus to the trigger." },
    ],
    notes: [
      "Radix DropdownMenu: `role=\"menu\"`, `menuitem`, `menuitemcheckbox`; disabled items are skipped.",
      "Icons in items are decorative (`aria-hidden`).",
    ],
  },
  related: ["popover", "command", "button"],
  web: {
    imports: ["DropdownMenu"],
    examples: [
      { name: "actions", title: "Actions", description: "A label, items with icons, a checkbox item, a separator and a destructive item." },
    ],
  },
} satisfies ComponentMeta;
