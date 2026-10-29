import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Page",
  summary:
    "The frame of every page: one width (`--kz-page-max`), one pair of gutters, one vertical rhythm — `Page`, `Section` (full-bleed, its heading, a hairline or the brand's backdrop as transition) and `SectionHeading`, with `Facts` and `Ticks`, and the papers (`ruled`, `lines`, `dot-grid`, `kraft`).",
  status: "beta",
  category: "blocks",
  domain: "page-blocks",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "A block of a public site's page; an app screen on a phone is built from Screen, Header and Card.", use: "screen" }, desktop: { status: "n/a", reason: "A public site's page, not a window of the Mac app." } },
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
    "Import the blocks' stylesheet once, by package path, in the app's root layout: `import \"@krizaka/ui/blocks.css\"`.",
    "One frame per site: set `--kz-page-max` once (72rem by default) and give the navigation the same width.",
    "`size=\"narrow\"` for a column of text, `wide` for documentation with a sidebar — never a width of your own.",
    "Give every titled section an `id`: it is its anchor and, through `aria-labelledby`, its name.",
    "`paper`: `ruled`, `lines`, `dot-grid` or `kraft` (absent is plain). Put the paper on a page or a section, never under a dense app screen; every word stays on the paper, never on a texture.",
    "`kraft` needs `PaperGrain` mounted once in the root layout (a hidden inline SVG filter with a fixed seed, no image file). Without it the paper is flat, never broken.",
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
    imports: ["Page", "Section", "SectionHeading", "Facts", "Ticks", "PaperGrain"],
    examples: [
      { name: "sections", title: "Sections", description: "Two sections on one rhythm, a hairline between them (`divider`)." },
      { name: "backdrop", title: "Section on the brand's backdrop", description: "`backdrop`: the colour transition behind a closing call, the actions on the right of the heading." },
      { name: "frame", title: "The frame alone", description: "`Page` in its three widths: narrow, default, wide." },
      { name: "papers", title: "Papers", description: "`paper`: `ruled`, `lines`, `dot-grid` (a dot every 24 px) — absent is plain." },
      { name: "kraft", title: "Kraft paper", description: "`paper=\"kraft\"` with the one `PaperGrain` the host mounts: brown paper, ink at 7:1 on its darkest grain point." },
      { name: "facts", title: "Facts and ticks", description: "Honest facts under a title, and a sentence where backticks read as code." },
    ],
  },
} satisfies ComponentMeta;
