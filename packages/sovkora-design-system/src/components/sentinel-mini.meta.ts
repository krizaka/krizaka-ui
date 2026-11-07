import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Sentinel mini",
  summary:
    "The Sentinel, Sovkora's guardian, at 24 px: a core, a ring and an orbit in the accent — for a sidebar, a header, a loading corner.",
  why: "The Sovkora mark (`SovkoraLogo`, @krizaka/ui) signs the product; the Sentinel stands for what watches over the requests — the interceptors. It is drawn once here, in the accent role, so it follows the brand and every named theme.",
  status: "stable",
  category: "foundations",
  platforms: "web",
  builtOn: [],
  whenToUse: [
    "Next to a section that the governance watches (the console's pipeline, the audit trail).",
    "As a small brand accent in a dense sidebar where the mark would be too much.",
  ],
  whenNotToUse: [
    { when: "As the product's logo: use `SovkoraLogo` from @krizaka/ui." },
    { when: "As a loading indicator.", use: "ui/spinner" },
  ],
  bestPractices: [
    "Decorative: put it next to a text that says what it means.",
    "Keep it small (16–32 px): its strokes are drawn for that size.",
  ],
  accessibility: {
    keyboard: [],
    notes: ["`aria-hidden`: decorative.", "Strokes and fills read `--kz-accent`: it follows the theme."],
  },
  related: ["chat-showcase", "icon", "ui/mascots"],
  web: {
    imports: ["SentinelMini"],
    examples: [
      {
        name: "sidebar",
        title: "In a sidebar heading",
        description: "Beside the name of the section the governance watches.",
      },
    ],
  },
} satisfies ComponentMeta;
