import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Longform page",
  summary: "A long read — a story, an essay, a case: numbered chapters in a reading column, pull quotes in the margin, figures that break out.",
  status: "beta",
  category: "templates",
  platforms: "web",
  whenToUse: ["A company's story, a case study, an essay.", "Any text read from the top, chapter by chapter."],
  whenNotToUse: [
    { when: "For a documentation article.", use: "docs-article-page" },
    { when: "For a policy.", use: "legal-page" },
  ],
  bestPractices: ["Chapters of three to six paragraphs; one pull quote at most each.", "Figures carry a promise (a bird's quote, a schema), never decoration.", "Words and content arrive as props; the motion is the platform's (`[data-reveal]`, still under reduced motion)."],
  accessibility: {
    keyboard: [],
    notes: ["Each chapter is a `section` named by its `h2`; the numbers are decorative.", "The pull quote repeats the text: it adds nothing a reader would miss."],
  },
  related: ["mascot-quote", "page-hero", "legal-page"],
  web: {
    imports: ["LongformPage"],
    examples: [
      { name: "story", title: "Our story", description: "Krizaka's story in chapters, a pull quote and the flamingo's rule.", template: true },
    ],
  },
} satisfies ComponentMeta;
