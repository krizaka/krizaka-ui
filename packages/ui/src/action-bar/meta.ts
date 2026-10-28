import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Action bar",
  summary:
    "A row of link actions — discuss, propose, report, read the docs, see the code: buttons with their words at the end of a page, or icon buttons whose words are a tooltip at the foot of a card.",
  status: "beta",
  category: "blocks",
  domain: "page-blocks",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "A block of a public site's page; an app screen on a phone is built from Screen, Header and Card.", use: "button" }, desktop: { status: "n/a", reason: "A public site's page, not a window of the Mac app." } },
  whenToUse: [
    "The ways to answer at the end of a page or in a `CtaPanel`.",
    "Secondary actions at the foot of a card, where room is short (`variant=\"icons\"`).",
  ],
  whenNotToUse: [
    { when: "For actions that run in the app (save, delete): those are buttons, not links.", use: "button" },
    { when: "For a menu of many choices.", use: "dropdown-menu" },
  ],
  bestPractices: [
    "Order by importance; `primaryFirst` when one action is what the block is about.",
    "Two or three actions; more belong in a menu or a page.",
    "Icons from the signature set, the same icon for the same action everywhere.",
  ],
  accessibility: {
    keyboard: [{ keys: "Tab", action: "Moves between the actions; an icon action shows its words while focused." }],
    notes: [
      "A list named by `label`; each action is a link with its words as its accessible name.",
      "An absolute address opens in a new tab and wears the external mark.",
      "The tooltip of an icon action is CSS only (no portal, no script): it repeats the accessible name.",
    ],
  },
  related: ["cta-panel", "button", "argument-card"],
  web: {
    imports: ["ActionBar"],
    examples: [
      { name: "buttons", title: "Buttons", description: "Read, see the code, discuss — the first one primary." },
      { name: "icons", title: "Icon actions", description: "Discuss, propose, report: icon buttons with their words in a tooltip." },
    ],
  },
} satisfies ComponentMeta;
