import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Table of contents",
  summary:
    "The sections of a reading page: sticky beside the content on a wide screen, a row of chips that scrolls sideways on a phone, the section being read marked — with `TocLayout` to place it.",
  status: "beta",
  category: "blocks",
  platforms: "web",
  whenToUse: [
    "A long page read in sections: a building block's page, a guide, a policy.",
    "When readers jump to one part (install, decisions, status) more than they read from the top.",
  ],
  whenNotToUse: [
    { when: "For the navigation between pages.", use: "nav-bar" },
    { when: "For a short page of two or three screens: the headings are enough.", use: "page" },
  ],
  bestPractices: [
    "Three to eight entries, the words of the section titles.",
    "Every entry points at a heading's `id` (a `Section`'s): its anchor.",
    "Set `--kz-anchor-offset` once to clear a fixed navigation bar.",
  ],
  accessibility: {
    keyboard: [{ keys: "Tab", action: "Moves through the sections' links; Enter jumps to the section." }],
    notes: [
      "A `nav` named by its label, with an ordered list of links.",
      "The section being read carries `aria-current=\"location\"`, found by one IntersectionObserver.",
    ],
  },
  related: ["page", "nav-bar", "tabs"],
  web: {
    imports: ["Toc", "TocLayout"],
    examples: [{ name: "reading-page", title: "A reading page", description: "Three sections, the contents in a sticky column beside them." }],
  },
} satisfies ComponentMeta;
