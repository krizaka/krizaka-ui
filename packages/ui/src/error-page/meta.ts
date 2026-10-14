import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Error page",
  summary: "When a page is not there: the code drawn huge, the bird that lost its way, one sentence, a search and the ways back — never a dead end.",
  status: "beta",
  category: "templates",
  platforms: "web",
  whenToUse: ["Not found (404), server error (500), offline.", "Any page that cannot show what was asked."],
  whenNotToUse: [
    { when: "For something not built yet.", use: "status-page" },
    { when: "For an empty list inside a page.", use: "empty-state" },
  ],
  bestPractices: ["The title says it in words; the code is drawn, not read.", "Offer a search and two or three ways back.", "Words and content arrive as props; the motion is the platform's (`[data-reveal]`, still under reduced motion)."],
  accessibility: {
    keyboard: [],
    notes: ["The code is hidden from assistive technology; the `h1` says what happened.", "The ways back are a named list of links."],
  },
  related: ["status-page", "search-field", "action-bar"],
  web: {
    imports: ["ErrorPage"],
    examples: [
      { name: "not-found", title: "Not found", description: "The pigeon, a search and three ways back.", template: true, purpose: "recover", why: "A lost visitor gets back on track with a search and a few ways out, never a dead end." },
    ],
  },
} satisfies ComponentMeta;
