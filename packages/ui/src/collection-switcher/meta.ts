import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Collection switcher",
  summary:
    "Moves between the collections of a workspace, flat or nested, with the default one marked and never removable; in entity mode, a compact switcher for a shop or a studio.",
  status: "beta",
  category: "navigation",
  domain: "navigation-shell",
  platforms: "both",
  parity: { desktop: "web" },
  whenToUse: [
    "To move between the collections (folders, albums, lists) of a workspace, the current one being the URL's.",
    "In the shell, `mode=\"entity\"`, to switch the shop or studio an owner is working on.",
  ],
  whenNotToUse: [
    { when: "For the sections of one page.", use: "tabs" },
    { when: "For a long list of records to read and sort.", use: "data-table" },
  ],
  bestPractices: [
    "The current collection is the route's: read `value` from the URL and navigate in `onValueChange`, or give `href` so each row is a real link.",
    "Mark one collection `isDefault`: it carries the `defaultLabel` and has no remove action; the server refuses its removal with `DEFAULT_COLLECTION`.",
    "Nest only when it helps (`layout=\"tree\"` with `parentId`); a list reads faster.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Moves through the rows and their remove buttons, in the order of the list." },
      { keys: "Enter / Space", action: "Chooses a collection; in entity mode, opens and closes the list." },
      { keys: "Escape", action: "Closes the entity list and returns to its button." },
    ],
    notes: [
      "A `nav` named by `label`; the current row has `aria-current=\"page\"`.",
      "The default collection is said in text (`defaultLabel`), not by colour; each remove button is named for its collection.",
    ],
  },
  related: ["entity-header", "tabs", "list"],
  web: {
    imports: ["CollectionSwitcher"],
    examples: [
      { name: "list", title: "A list", description: "Collections with counts, the default one marked, a remove action and a create row." },
      { name: "tree", title: "Nested", description: "Collections under a parent, opened together." },
      { name: "entity", title: "Shop switcher", description: "A compact button for the shell: switch the shop or studio." },
    ],
  },
  native: {
    imports: ["CollectionSwitcher"],
    differences: ["Same data and layouts. Rows are 44-point targets; in entity mode the list opens under the button instead of a popover."],
    examples: [{ name: "list", title: "Nested list", description: "Collections nested under a parent, the default one marked." }],
  },
} satisfies ComponentMeta;
