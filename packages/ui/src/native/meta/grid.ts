import type { ComponentMeta } from "../../meta";

export const meta = {
  title: "Grid and columns",
  summary: "Layouts that choose their columns from the room they are given — compact, regular or expanded — never from a device name: a grid of equal cells that never gets narrower than `minItemWidth`, and columns that sit side by side or stack. Safe with right-to-left and with text at 200 %.",
  status: "beta",
  category: "layout",
  domain: "navigation-shell",
  platforms: "native",
  parity: { web: { status: "n/a", reason: "On the web the grid is CSS and the page's width is the container query.", use: "card-grid" }, desktop: { status: "n/a", reason: "The Mac app's window is the web: its columns are the web grid's.", use: "card-grid" } },
  whenToUse: [
    "A screen of cards, photos or stats that is one column on a phone, two on a large phone in landscape or a small tablet, three or more on a tablet.",
    "A form and its summary, a master and its detail: columns that stack when the room is too narrow.",
    "An app that runs in a split view or on a foldable: the grid follows the room, not the screen.",
  ],
  whenNotToUse: [
    { when: "A long, uniform list of rows that scrolls.", use: "list" },
    { when: "A list and the item open from it, as a screen.", use: "list-detail" },
  ],
  bestPractices: [
    "Ask for columns by size class: `{ compact: 1, regular: 2, expanded: 3 }` is the default; a gallery says `{ compact: 2, regular: 3, expanded: 4 }`. The numbers are a ceiling.",
    "Set `minItemWidth` to what the item needs to be readable (a stat card 140, a photo 100): the grid drops columns before an item gets narrower, so nothing overflows.",
    "The minimum grows with the system's text scale: at 200 % a card that held two per row on a phone stacks into one. Test it with `fontScale={2}`.",
    "Cells of a row are as tall as the tallest: give the item `flex: 1` (a plain `View` is filled already), and `equalHeight={false}` for items of free height.",
    "Use the gap tokens (`xs` 4, `sm` 8, `md` 12, `lg` 16, `xl` 24), never a number.",
    "The size class is read from the width the grid is given (`useSizeClass()` reads the window): inside a split view or a sheet the grid adapts to that, not to the screen.",
    "Right-to-left needs nothing: the grid uses no physical edge, the first item is at the start edge.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "A grid with an `aria-label` is a list and its cells are list items, so a screen reader announces `Photos, list, 8 items`.",
      "The reading order is the order of the children in every size class; columns only change where they sit.",
      "At 200 % text no cell is narrower than `minItemWidth` × 2: the text wraps in a wide cell instead of being cut.",
    ],
  },
  related: ["screen", "list", "list-detail", "card-grid"],
  native: {
    imports: ["Grid", "Columns", "useSizeClass", "useFontScale", "sizeClassOf", "gridColumns"],
    differences: [],
    examples: [
      { name: "photos", title: "Photos", description: "Two columns on a compact room, three on a regular one, four on an expanded one; tiles never narrower than 120 pt." },
      { name: "stats", title: "A stat strip", description: "Cards of equal height: two per row on a phone, four on a tablet, one at 200 % text." },
      { name: "columns", title: "Columns", description: "A third and two thirds that stack when the room cannot hold them." },
    ],
  },
} satisfies ComponentMeta;
