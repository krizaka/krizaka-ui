import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Combobox",
  summary: "A text field that suggests and completes — one value or several as chips, from a static list or a server, with values created from what was typed.",
  status: "beta",
  category: "forms",
  domain: "forms",
  platforms: "both",
  parity: { desktop: "web" },
  whenToUse: [
    "To choose among many values the person knows by name: a creator, a country, a model, a playlist.",
    "With `onSearch` when the values live on a server (debounced, the previous request aborted).",
    "With `multiple` for several values (collaborators, categories), and `creatable` when a new one can be added.",
  ],
  whenNotToUse: [
    { when: "For fewer than about seven options known in advance: radios or a select.", use: "radio-group" },
    { when: "For free words without a closed list (tags, keywords): a tag input.", use: "tag-input" },
    { when: "To run a search and show results: a search field.", use: "search-field" },
  ],
  bestPractices: [
    "Write `label` as the question (“Collaborators”), the `placeholder` as an example (“Type a name”).",
    "Return at most 20 options from `onSearch`; put the best match first.",
    "Give options a `description` when names collide (two creators named Eric: their handles).",
    "Set `maxSelected` when the product has a limit, and say it in `hint`.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Arrow Down / Arrow Up", action: "Open the list and move the active option." },
      { keys: "Home / End", action: "First or last option, when the list is open." },
      { keys: "Enter", action: "Choose the active option (or create the typed value)." },
      { keys: "Esc", action: "Close the list; for one value, restore its label." },
      { keys: "Backspace", action: "In an empty input, remove the last chip." },
    ],
    notes: [
      "The ARIA 1.2 combobox pattern: the focus stays in the input, `aria-activedescendant` points at the active option of the `listbox`.",
      "The number of results is announced in a polite live region (`labels.results`).",
      "Chosen options carry `aria-selected`; each chip's remove button is named (“Remove Eric”).",
      "The label is a real `<label>`; `hint` and `error` are wired with `aria-describedby`, `error` sets `aria-invalid`.",
    ],
  },
  related: ["tag-input", "search-field", "field", "chip", "command"],
  web: {
    imports: ["Combobox"],
    examples: [
      { name: "async", title: "From a server", description: "`onSearch`: creators fetched as you type, debounced, the stale request aborted." },
      { name: "multiple", title: "Several values", description: "Collaborators as chips; Backspace removes the last one, at most three." },
      { name: "creatable", title: "Create a value", description: "Pick a playlist or create one from what was typed." },
      { name: "invalid", title: "With an error", description: "A required choice left empty: the error is read with the field." },
    ],
  },
  native: {
    imports: ["Combobox"],
    differences: [
      "A field that opens a `Sheet` with a search box and the matching options: radios for one value, checkboxes and a Done button with `multiple`.",
      "`onSearch(query, signal)` is debounced (250 ms) and aborted by a newer query, as on the web; no `creatable` yet.",
    ],
    examples: [
      { name: "search", title: "Search", description: "Cities filtered as you type." },
      { name: "multiple", title: "Several values", description: "Interests as checkboxes; the field lists them." },
    ],
  },
} satisfies ComponentMeta;
