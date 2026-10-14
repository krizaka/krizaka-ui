import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Marketing layout",
  summary: "A site's page: the link that skips to the content, the floating bar, the page made of a PageHero and Sections in one frame, the footer.",
  status: "beta",
  category: "layouts",
  platforms: "web",
  whenToUse: ["Every public page of a Krizaka site: a product, pricing, a hub, a story.", "A product's public landing."],
  whenNotToUse: [
    { when: "For a signed-in screen.", use: "app-shell" },
    { when: "For a documentation page with a sidebar.", use: "docs-layout" },
  ],
  bestPractices: ["One PageHero per page, then Sections; the main action of the page is the only one with `shimmer`.", "Give the bar the frame's width (`--kz-page-max`): its edges are the content's.", "Templates show complete pages: copy one, keep its order."],
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "The first stop is the skip link, which jumps to the page's content." }
    ],
    notes: ["`main#content` receives the focus from the skip link.", "The bar floats over the hero: `--kz-hero-top` keeps the title clear of it."],
  },
  related: ["page-hero", "page", "nav-bar"],
  web: {
    imports: ["MarketingLayout"],
    examples: [
      { name: "product-page", title: "A product page", description: "Orazaka's page: hero with facts, reasons, decisions, the owl's promise, the closing call.", template: true, purpose: "convince", why: "A visitor decides whether a product is for them: the promise first, the proof and the call after." },
      { name: "pricing", title: "Pricing and credits", description: "Plans side by side, what a credit buys, the credits left.", template: true, purpose: "convince", why: "A buyer compares plans and sees what a credit buys before deciding to commit." },
      { name: "docs-hub", title: "A documentation hub", description: "Groups of compact link cards under the hero.", template: true, purpose: "explain", why: "A newcomer finds the right documentation from one page of grouped entry points." },
      { name: "basic", title: "The layout alone", description: "Skip link, bar, hero, a section and a footer." },
    ],
  },
} satisfies ComponentMeta;
