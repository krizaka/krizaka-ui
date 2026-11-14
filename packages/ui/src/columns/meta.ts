import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Grid and columns",
  summary: "Layouts that decide on the width of their container, not the viewport — compact, regular or expanded — like the native ones: a grid of equal cells that never gets narrower than `minItemWidth`, and weighted columns that sit side by side or stack. Pure CSS (`@container`), safe with right-to-left and with text at 200 %.",
  status: "beta",
  category: "layout",
  domain: "navigation-shell",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "React Native has its own Grid and Columns with the same props: they measure the room with `onLayout`.", use: "grid" }, desktop: "web" },
  whenToUse: [
    "A block of cards, photos or stats that is one column in a narrow panel, two in a regular one and three or more in a wide one — wherever it is placed, in a page, a side sheet or a builder canvas.",
    "A form and its summary, a master and its detail: weighted columns that stack when their container is too narrow.",
    "A page the user zooms or whose text they enlarge: the room an item needs grows with the text, so nothing overflows.",
  ],
  whenNotToUse: [
    { when: "A grid of cards with a staggered reveal on a site's page.", use: "card-grid" },
    { when: "A table of data that sorts, filters and pages.", use: "data-table" },
    { when: "A page frame with a header, a body and a side.", use: "detail-layout" },
  ],
  bestPractices: [
    "Ask for columns by size class of the container: `{ compact: 1, regular: 2, expanded: 3 }` is the default; a gallery says `{ compact: 2, regular: 3, expanded: 4 }`. The numbers are a ceiling.",
    "Set `minItemWidth` to what the item needs to be readable (a stat card 140, a photo 100): the grid drops columns before an item gets narrower.",
    "`Columns` stacks below `minColumnWidth` (280 by default) per column; weights `[1, 2]` give a third and two thirds side by side.",
    "Use the gap tokens (`xs` 4, `sm` 8, `md` 12, `lg` 16, `xl` 24), never a number: they are the same as native.",
    "The grid is an inline-size container: give it a width from its parent (a block is enough), not a shrink-to-fit one.",
    "Right-to-left needs nothing: no physical edge is used, the first item is at the start edge.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "A grid with an `aria-label` is a list and its cells are list items, so a screen reader announces `Photos, list, 8 items`.",
      "The reading order is the order of the children in every size class; columns only change where they sit.",
      "Widths are in `rem`: at 200 % text no cell is narrower than twice `minItemWidth`, so the text wraps in a wide cell instead of being cut.",
    ],
  },
  related: ["card-grid", "detail-layout", "choice-grid"],
  web: {
    imports: ["Grid", "Columns"],
    examples: [
      { name: "photos", title: "Photos", description: "Two columns in a compact container, three in a regular one, four in an expanded one; tiles never narrower than 120 px." },
      { name: "stats", title: "A stat strip", description: "Cards of equal height: two per row in a narrow container, four in a wide one, one at 200 % text." },
      { name: "columns", title: "Columns", description: "A third and two thirds that stack when the container cannot hold them." },
    ],
  },
} satisfies ComponentMeta;
