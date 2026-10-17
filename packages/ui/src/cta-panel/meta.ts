import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Call-to-action panel",
  summary: "The invitation at the end of a section or a page: a title, why it matters, the ways to answer — in the hue of the page.",
  status: "beta",
  category: "blocks",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "A block of a public site's page; an app screen on a phone is built from Screen, Header and Card.", use: "button" }, desktop: { status: "n/a", reason: "A public site's page, not a window of the Mac app." } },
  whenToUse: [
    "The end of a page that argued: discuss, propose, contact, get started.",
    "The end of a section that asks the reader for something.",
  ],
  whenNotToUse: [
    { when: "For a message about the state of the app.", use: "alert" },
    { when: "For a whole closing section on the brand's gradient.", use: "page" },
  ],
  bestPractices: [
    "One invitation per panel, one or two actions (an `ActionBar`).",
    "Say why answering matters to the reader, not to you.",
    "Give it an `id` when other pages link to it (`#discuss`).",
  ],
  accessibility: {
    keyboard: [],
    notes: ["Its title is a real heading (`h2` or `h3`): it appears in the page's outline.", "The tint is decorative; text stays in the text roles (AA)."],
  },
  related: ["action-bar", "page", "button"],
  web: {
    imports: ["CtaPanel"],
    examples: [{ name: "discuss", title: "Discuss", description: "The end of a building block's page: discuss or propose." }],
  },
} satisfies ComponentMeta;
