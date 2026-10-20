import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Link card",
  summary:
    "An entry point where the whole card is one link: an icon tile, a title, one sentence and the way in — compact, the same on every page; under the pointer its surface and hairline go one step up, nothing moves.",
  status: "beta",
  category: "blocks",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "A block of a public site's page; an app screen on a phone is built from Screen, Header and Card.", use: "card" }, desktop: { status: "n/a", reason: "A public site's page, not a window of the Mac app." } },
  whenToUse: [
    "The entry points of a hub: a documentation's sections, the products, the next steps of a guide.",
    "Any link that deserves more than its words: what the reader finds there, in one sentence.",
  ],
  whenNotToUse: [
    { when: "When the card holds several actions: a card that is a link holds no other link.", use: "argument-card" },
    { when: "For a link inside a sentence or a list of plain links.", use: "chip-link" },
  ],
  bestPractices: [
    "One sentence of description; the title names the destination, the way in (`cta`) says the action.",
    "Use the product's mark or a signature icon as `icon`, never a placeholder.",
    "Pass the app's router link as `linkAs` (Next's `Link`) so internal links prefetch.",
    "In a row of cards at one height (`CardGrid`), the facts (`extra`) and the way in (`cta`) are pinned to the foot of each card, so they share a line whatever the length of the sentences; `footerAlign=\"top\"` keeps them under the text.",
    "In a hub, keep the default `h3` titles under the section's `h2`; in a list of links, `titleAs=\"span\"`.",
  ],
  accessibility: {
    keyboard: [{ keys: "Tab", action: "Focuses the card: a 2 px ring of `--kz-ring` around it." }],
    notes: [
      "The card is a single link: its accessible name is its whole text — keep it short.",
      "An absolute address opens in a new tab with `rel=\"noopener noreferrer\"` and the external mark.",
      "The icon and the arrow are decorative; the arrow's lean stops under `prefers-reduced-motion`.",
      "The hover keeps the same text contrast in dark and light: it moves the surface and the hairline one step, never the text below AA. `hover` is deprecated since 3.31 (krizaka-ui#393): there is one hover.",
    ],
  },
  related: ["card-grid", "glow-card", "chip-link"],
  web: {
    imports: ["LinkCard"],
    examples: [
      { name: "docs-hub", title: "A documentation hub", description: "Three compact cards in a grid: a mark, a title, a sentence, `Open`." },
      { name: "stack", title: "Stacked, with facts", description: "`layout=\"stack\"`, a category above the title and facts under the text." },
      { name: "external", title: "An external link", description: "An absolute address: a new tab and the external mark." },
      { name: "hover-quiet", title: "The hover", description: "One step of surface and border under the pointer, a ring on focus; nothing moves, no light." },
    ],
  },
} satisfies ComponentMeta;
