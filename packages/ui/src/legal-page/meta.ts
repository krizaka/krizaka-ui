import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Legal page",
  summary: "A policy or terms: the date in force, the short version in plain words, the sections in a narrow column with their contents beside them.",
  status: "beta",
  category: "templates",
  platforms: "web",
  whenToUse: ["Privacy, terms, cookies, a licence.", "Any document read section by section."],
  whenNotToUse: [
    { when: "For a long read with chapters.", use: "longform-page" },
    { when: "For a documentation article.", use: "docs-article-page" },
  ],
  bestPractices: ["Open with the short version in plain words.", "Date the document; keep each section to one subject.", "Words and content arrive as props; the motion is the platform's (`[data-reveal]`, still under reduced motion)."],
  accessibility: {
    keyboard: [],
    notes: ["Sections are named by their `h2`; the contents a named `nav`.", "The summary is plain text, read first."],
  },
  related: ["toc", "longform-page", "page"],
  web: {
    imports: ["LegalPage"],
    examples: [
      { name: "privacy", title: "Privacy policy", description: "A summary and three sections with their contents.", template: true },
    ],
  },
} satisfies ComponentMeta;
