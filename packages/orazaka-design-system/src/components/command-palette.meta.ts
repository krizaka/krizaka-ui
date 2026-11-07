import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Command palette",
  summary:
    "The Orazaka ⌘K palette: jump to a studio, a chat, a setting — sections, registry icons and a footer of hints, on the platform's command dialog.",
  why: "`CommandDialog` from @krizaka/ui gives the combobox, the filtering, the focus trap and Escape. Orazaka adds what is its own: the ⌘K / Ctrl+K shortcut, entries grouped by section with the Orazaka icon registry, and the footer of keyboard hints its consoles share.",
  status: "stable",
  category: "navigation",
  platforms: "web",
  builtOn: ["ui/command", "ui/kbd", "ui/dialog"],
  whenToUse: [
    "Once per app shell: the client app and the console, for power users who navigate by keyboard.",
    "To reach an action that has no place in the navigation (new chat, switch theme).",
  ],
  whenNotToUse: [
    { when: "As the only way to reach a page: everything stays reachable from the navigation." },
    { when: "For a search over content (documents, conversations) with results to read.", use: "ui/command" },
  ],
  bestPractices: [
    "Pass `commands` and `labels` translated (both required since 3.0).",
    "Give `onNavigate` outside Next.js (or in tests); inside, it uses the router.",
    "Short labels, verbs for actions (`New chat`), nouns for places (`Studios`).",
  ],
  accessibility: {
    keyboard: [
      { keys: "⌘ K / Ctrl K", action: "Opens and closes the palette." },
      { keys: "↑ ↓", action: "Moves through the results." },
      { keys: "Enter", action: "Runs the highlighted entry." },
      { keys: "Esc", action: "Closes it and returns the focus." },
    ],
    notes: [
      "A dialog with a combobox and a listbox (cmdk on Radix): named by `labels.label`, results by `labels.results`.",
    ],
  },
  related: ["icon", "ui/command", "ui/kbd"],
  web: {
    imports: ["CommandPalette"],
    examples: [
      {
        name: "workspace",
        title: "Eric's workspace",
        description: "Studios, chats and settings, opened with ⌘K or the button.",
      },
    ],
  },
} satisfies ComponentMeta;
