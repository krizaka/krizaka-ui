import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Command",
  summary: "A command palette on cmdk: a search input over a filtered list of commands, inline or in a dialog.",
  status: "beta",
  category: "navigation",
  platforms: "web",
  whenToUse: [
    "To reach any page or action of an app from the keyboard (⌘K): `CommandDialog`.",
    "For a searchable list of choices inside a panel: `Command.Root` inline.",
    "When results come from the server: `shouldFilter={false}` and `Command.Loading`.",
  ],
  whenNotToUse: [
    { when: "For a short list of actions on one item.", use: "dropdown-menu" },
    { when: "For a choice among a few options in a form: use a select or radios.", use: "radio-group" },
    { when: "As the only way to navigate: keep the visible navigation." },
  ],
  bestPractices: [
    "Group the commands (`Command.Group heading`) and show their shortcuts with `Command.Shortcut`.",
    "Add `keywords` so a command is found by the words people type, not only by its label.",
    "Always say what an empty search means with `Command.Empty emptyLabel`.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Arrow keys", action: "Move through the results." },
      { keys: "Enter", action: "Runs the highlighted command." },
      { keys: "Esc", action: "Closes the `CommandDialog` and returns the focus." },
    ],
    notes: [
      "A combobox and a listbox: the input owns `aria-activedescendant`, the results are options.",
      "`label` names the palette, `Command.List label` the results.",
      "`CommandDialog` traps the focus in the platform's Dialog and puts it in the input when it opens.",
    ],
  },
  related: ["dialog", "dropdown-menu", "kbd"],
  web: {
    imports: ["Command", "CommandDialog"],
    examples: [
      { name: "inline", title: "Inline", description: "In a card: the input, groups, shortcuts, a disabled item." },
      { name: "empty", title: "No result", description: "What `emptyLabel` says when nothing matches." },
      { name: "dialog", title: "In a dialog", description: "`CommandDialog`: the palette of an app, opened from a button or a shortcut." },
    ],
  },
} satisfies ComponentMeta;
