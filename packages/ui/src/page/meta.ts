import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Page",
  summary:
    "The frame of every page: one width (`--kz-page-max`), one pair of gutters, one vertical rhythm — `Page`, `Section` (full-bleed, its heading, a hairline or the brand's backdrop as transition) and `SectionHeading`, with `Facts` and `Ticks`.",
  status: "beta",
  category: "blocks",
  platforms: "web",
  whenToUse: [
    "Around every block of a site's page, so the navigation, the hero and each section share the same edges at any width.",
    "To chain the sections of a page on one rhythm: `divider` for a transition on the same surface, `backdrop` for the brand's colour transition.",
    "`Facts` for a few honest facts under a title (registry and version, a status in progress); `Ticks` for a translated sentence with code in it.",
  ],
  whenNotToUse: [
    { when: "Inside an app's screen, under its own shell: the app's layout already frames its content.", use: "page-header" },
    { when: "To frame one item on a page.", use: "card" },
  ],
  bestPractices: [
    "One frame per site: set `--kz-page-max` once (72rem by default) and give the navigation the same width.",
    "`size=\"narrow\"` for a column of text, `wide` for documentation with a sidebar — never a width of your own.",
    "Give every titled section an `id`: it is its anchor and, through `aria-labelledby`, its name.",
    "`reveal` on headings below the first screen only: what the visitor sees on arrival is painted at once.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "A `Section` with a title is a `section` named by its heading (`aria-labelledby`); without one it is a plain region of the page.",
      "`SectionHeading` renders a real `h2` (or `h3`): keep the outline in order — one `h1` per page, in the hero.",
      "`Facts` is a list; a fact with `href` opens in a new tab. `Ticks` renders `code` elements, read as text.",
    ],
  },
  related: ["page-hero", "section-backdrop", "card-grid"],
  web: {
    imports: ["Page", "Section", "SectionHeading", "Facts", "Ticks"],
    examples: [
      { name: "sections", title: "Sections", description: "Two sections on one rhythm, a hairline between them (`divider`)." },
      { name: "backdrop", title: "Section on the brand's backdrop", description: "`backdrop`: the colour transition behind a closing call, the actions on the right of the heading." },
      { name: "frame", title: "The frame alone", description: "`Page` in its three widths: narrow, default, wide." },
      { name: "facts", title: "Facts and ticks", description: "Honest facts under a title, and a sentence where backticks read as code." },
    ],
  },
} satisfies ComponentMeta;
