import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Argument card",
  summary:
    "A compact card that argues — about a third of a full card: who (icon, name, the bird in the corner), the trap in one line, facts and one short action; the long version lives on a detail page or unfolds in place.",
  status: "beta",
  category: "blocks",
  domain: "page-blocks",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "A block of a public site's page; an app screen on a phone is built from Screen, Header and Card.", use: "card" }, desktop: { status: "n/a", reason: "A public site's page, not a window of the Mac app." } },
  whenToUse: [
    "The reasons of a product page, the building blocks of an open-source page, the options of a decision.",
    "When each subject has a problem to state before its solution, and a reader who scans before reading.",
  ],
  whenNotToUse: [
    { when: "When the card only leads somewhere.", use: "link-card" },
    { when: "For the decisions behind a choice, compared side by side.", use: "decision-list" },
  ],
  bestPractices: [
    "The hook is ONE line (≤ 90 characters, regular weight) a reader keeps in five seconds — never three bold lines.",
    "What it does, the bird's quote and the long version are never on the face: a detail page (`more`), or `panelLabel`.",
    "One idea per card; one bird per idea: small in the corner (`mark`), its quote (`rule`) where the card unfolds.",
    "Give each subject its hue with `--kz-hue` on the card (or a wrapper); the brand's accent otherwise.",
    "Secondary actions as an icon `ActionBar` in `actions`; the way in as `more`.",
  ],
  accessibility: {
    keyboard: [{ keys: "Enter / Space", action: "On the panel's summary, opens or closes the long version." }],
    notes: [
      "An `article` named by its title; the hook's label is read before the line (visually hidden); the fold is a native `details` element.",
      "The way in is described by the card's title (`aria-describedby`), so several `Read more` links stay distinct.",
      "One quiet hover (krizaka-ui#393): the surface and the hairline go one step up in a short colour transition — nothing moves, no light follows the pointer; a ring on the whole card when a link inside takes the keyboard focus. The panel's chevron stops under `prefers-reduced-motion`.",
    ],
  },
  related: ["card-grid", "mascot-quote", "action-bar"],
  web: {
    imports: ["ArgumentCard"],
    examples: [
      { name: "building-block", title: "A building block", description: "Compact: the duck in the corner, the trap in one line, facts, one short action and an icon action." },
      { name: "unfold", title: "Unfolded in place", description: "No detail page: `panelLabel` unfolds what it does, the cost and the pigeon's rule." },
      { name: "grid", title: "Three reasons", description: "A product's reasons side by side in a grid: the hook and the way in, no panel." },
      { name: "hover-quiet", title: "The quiet hover", description: "`hover=\"quiet\"` on a grid of reasons: no glow, a lift, a ring on focus." },
    ],
  },
} satisfies ComponentMeta;
