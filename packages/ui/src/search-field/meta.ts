import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Search field",
  summary: "A search box: a clear button, a global ⌘K / Ctrl+K shortcut, a debounced `onSearch`, Enter to submit, and suggestions with the keyboard.",
  status: "beta",
  category: "forms",
  platforms: "both",
  whenToUse: [
    "At the top of a list or a page to find by words: videos, creators, jobs, users.",
    "With `shortcut` for the site's global search, reachable from anywhere with ⌘K.",
    "With `suggestions` for recent searches or completions under the field.",
  ],
  whenNotToUse: [
    { when: "To choose a value from a list (the result is the value, not a search): a combobox.", use: "combobox" },
    { when: "For a palette of commands and destinations: the command palette.", use: "command" },
  ],
  bestPractices: [
    "Name it by what it searches (“Search videos”), and say it in the placeholder too.",
    "Fetch in `onSearch` (debounced), navigate in `onSubmit`; keep the query in the address.",
    "Show the shortcut only for the site's main search: one ⌘K per page.",
  ],
  accessibility: {
    keyboard: [
      { keys: "⌘ K / Ctrl K", action: "Focus the field from anywhere (with `shortcut=\"k\"`)." },
      { keys: "Enter", action: "Submit the query, or pick the active suggestion." },
      { keys: "Esc", action: "Close the suggestions, then clear the query." },
      { keys: "Arrow Down / Arrow Up", action: "Move through the suggestions." },
    ],
    notes: [
      "An `input type=\"search\"` named by `label`, inside a `search` landmark (`landmark={false}` inside a form that is one).",
      "With suggestions it follows the combobox pattern (`aria-activedescendant`, a `listbox`).",
      "The clear button is named by `clearLabel`; the shortcut's keys are decorative (`aria-hidden`).",
    ],
  },
  related: ["combobox", "command", "filter-bar", "kbd"],
  web: {
    imports: ["SearchField"],
    examples: [
      { name: "global", title: "Global search", description: "The site's search with its ⌘K shortcut, submitting to a results page." },
      { name: "suggestions", title: "Recent searches", description: "Suggestions under the field, walked with the arrows." },
      { name: "toolbar", title: "In a toolbar", description: "`size=\"sm\"`, filtering a list as you type." },
    ],
  },
  native: {
    imports: ["SearchField"],
    differences: [
      "No shortcut and no suggestions: the keyboard's search key submits, and results are a screen of their own.",
      "`clearLabel` is required; `role=\"searchbox\"` names the input.",
      "`cancelLabel` with `onCancel` adds the platform's Cancel button beside the field.",
    ],
    examples: [{ name: "default", title: "Default", description: "The glyph, the query, the clear button and the keyboard's search key." },
      { name: "cancel", title: "With Cancel", description: "The iOS search bar: a Cancel button that clears and closes the keyboard." },
    ],
  },
} satisfies ComponentMeta;
