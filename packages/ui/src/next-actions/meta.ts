import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Next actions",
  summary: "Two or three ranked, host-provided actions with their reason and urgency.",
  status: "beta",
  category: "blocks",
  platforms: "web",
  parity: {
    native: { status: "n/a", reason: "The native twin is a follow-up; compose the same actions in a native screen for now.", use: "button" },
    desktop: "web",
  },
  whenToUse: ["A shop owner needs to know what to do first from the figures on a page.", "A page should surface a few concrete follow-ups without inventing work."],
  whenNotToUse: [
    { when: "A person needs a toolbar for the current view.", use: "action-bar" },
    { when: "A person must choose from many secondary actions.", use: "dropdown-menu" },
  ],
  bestPractices: [
    "Pass two or three actions in priority order; the component preserves that order.",
    "Give each action one line on why it matters, a localized urgency word and a host-rendered link, button or command.",
  ],
  accessibility: {
    keyboard: [{ keys: "Tab", action: "Moves to each host-rendered action in list order." }],
    notes: ["An ordered list communicates the ranking without relying on colour.", "Every action and urgency word comes from the host."],
  },
  related: ["action-bar", "button", "stat"],
  web: {
    imports: ["NextActions"],
    examples: [{ name: "shop-owner", title: "A shop owner's next steps", description: "Three concrete actions ordered by urgency, with a reason for each." }],
  },
} satisfies ComponentMeta;
