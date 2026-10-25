import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Product page",
  summary: "A product's overview in its brand: split hero with facts and the product alive, the traps it removes as compact argument cards, its decisions with their cost, the promise a bird keeps, the closing call.",
  status: "deprecated",
  deprecated: {
    since: "3.55.0",
    removedIn: "4.0.0",
    use: "landing-page",
    reason: "No page uses this template and no filed need names it (ADR-006 audit, 2026-10-25). Compose a product page on `LandingPage`.",
  },
  category: "templates",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "A whole page of a public site; a phone app's screens are built from Screen, Header and the native primitives." }, desktop: { status: "n/a", reason: "A public site's page, not a window of the Mac app." } },
  whenToUse: ["The overview of each product (Orazaka, Orochia, Yasakia).", "A building block's page that argues its decisions."],
  whenNotToUse: [
    { when: "For the whole company's home.", use: "landing-page" },
    { when: "For the steps of how it works.", use: "how-it-works-page" },
  ],
  bestPractices: ["The traps in one line each; the long version on the page `href` leads to.", "Say what every decision costs: a decision without its cost is an advertisement.", "Pass `brand`: the page wears the product's colour.", "Words and content arrive as props; the motion is the platform's (`[data-reveal]`, still under reduced motion)."],
  accessibility: {
    keyboard: [],
    notes: ["One `h1` in the hero; each card an `article` named by its title.", "Decisions are an ordered list, each part labelled in words."],
  },
  related: ["argument-card", "decision-list", "landing-page"],
  web: {
    imports: ["ProductPage"],
    examples: [
      { name: "orazaka", title: "Orazaka", description: "The sovereign AI engine's overview, in its orange.", template: true, purpose: "convince", why: "A visitor understands what a product does, the traps it avoids and the decisions behind it, then acts." },
    ],
  },
} satisfies ComponentMeta;
