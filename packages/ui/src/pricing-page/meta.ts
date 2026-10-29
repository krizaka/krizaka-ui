import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Pricing page",
  summary: "Plans and what they cost: the plans side by side with the featured one lifted, the comparison as a table, what a credit buys, the questions people ask.",
  status: "beta",
  category: "templates",
  domain: "commerce",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "A whole page of a public site; a phone app's screens are built from Screen, Header and the native primitives." }, desktop: { status: "n/a", reason: "A public site's page, not a window of the Mac app." } },
  whenToUse: ["Pricing, credits, plans.", "Any choice between offers."],
  whenNotToUse: [
    { when: "For the credits left inside an app.", use: "meter" },
    { when: "For a product's overview." },
  ],
  bestPractices: ["Three plans at most; the featured one says why (`Most chosen`).", "Say what a credit buys in units people know.", "Words and content arrive as props; the motion is the platform's (`[data-reveal]`, still under reduced motion)."],
  accessibility: {
    keyboard: [],
    notes: ["The plans are a named list; the comparison a table with a caption and header cells.", "Questions are native disclosures."],
  },
  related: ["meter", "glow-card"],
  web: {
    imports: ["PricingPage"],
    examples: [
      { name: "credits", title: "Orazaka plans and credits", description: "Three plans, the comparison, credits and two questions.", template: true, purpose: "convince", why: "A buyer compares three plans side by side and answers the last objections before choosing." },
    ],
  },
} satisfies ComponentMeta;
