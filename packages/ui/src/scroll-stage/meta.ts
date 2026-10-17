import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Scroll stage",
  summary:
    "The conductor of a told page: chapters (`Scene`) that play their entrance once, in order, as they scroll into view — the visual, then the announcement, then the words — with one slow loop each, running only while on screen.",
  status: "beta",
  category: "layout",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "Part of the storytelling kit of scroll-driven site pages; a phone app tells its first steps with Onboarding." }, desktop: { status: "n/a", reason: "A public site's page, not a window of the Mac app." } },
  whenToUse: [
    "A page that tells a story in chapters: an about page, a product tour, a launch, a year in review.",
    "An onboarding or a long landing page whose sections should arrive one at a time, at reading speed.",
    "To give a whole page the arcade flavour of the storytelling kit at once (`variant=\"arcade\"`).",
  ],
  whenNotToUse: [
    { when: "Ordinary pages: blocks that simply fade in as they enter.", use: "page" },
    { when: "Working screens (a dashboard, a form, a table): nothing there should wait to appear." },
  ],
  bestPractices: [
    "One `ScrollStage` per page, around the chapters; one `Scene` per chapter (a `section` by default).",
    "Mark the words of a chapter with `data-kzs-reveal`: they arrive after its visual and its banner (`--kzs-delay` to change when).",
    "Keep the first screen out of any scene's entrance: what the reader sees on arrival is painted at once.",
    "Import the kit's styles once: `import \"@krizaka/ui/story.css\"`.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "Under `prefers-reduced-motion` the stage never switches motion on: everything is visible and still.",
      "Nothing is hidden from assistive technology or from a page without JavaScript: content is only held invisible once the stage is on, until its scene enters.",
      "Each scene has at most one loop, slow and faint, paused off screen and never behind a paragraph.",
    ],
  },
  related: ["stage-banner", "goal-gauge", "profile-card", "choice-grid", "achievement", "continue-prompt"],
  web: {
    imports: ["ScrollStage", "Scene"],
    examples: [
      { name: "chapters", title: "Chapters", description: "Two chapters of an onboarding: each one's banner, then its words, then its gauge — once, as they scroll in." },
      { name: "arcade", title: "Arcade flavour", description: "`variant=\"arcade\"` once on the stage: a final round, the boss gauge draining." },
    ],
  },
} satisfies ComponentMeta;
