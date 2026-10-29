import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Page index",
  summary: "A book's index for a documentation or a catalogue: groups, entries, a dotted leader and the page number at the end of the line; the current entry marked in the margin.",
  status: "beta",
  category: "navigation",
  domain: "page-blocks",
  platforms: "web",
  parity: {
    native: { status: "n/a", reason: "A documentation sidebar; an app's navigation is its tab bar and lists.", use: "list" },
    desktop: "web",
  },
  whenToUse: [
    "The sidebar of a documentation: the components of a group, numbered as the pages of a reference book.",
    "The table of a catalogue or a long read, where a number helps the reader find a page again.",
  ],
  whenNotToUse: [
    { when: "The sections of the page being read.", use: "toc" },
    { when: "The navigation of an application.", use: "rail-nav" },
  ],
  bestPractices: [
    "Numbers are the reader's landmarks: keep them stable (a component keeps its number across versions).",
    "Group titles are short and typed in lower case; three to eight entries per group.",
    "Pass the router link as `linkAs` so internal entries prefetch.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "A `nav` named by `label` (« Index »); each group a heading and a list of links.",
      "The current entry carries `aria-current=\"page\"`; the margin's arrow and the dotted leader are decorative.",
    ],
  },
  related: ["docs-nav", "toc", "docs-layout"],
  web: {
    imports: ["PageIndex"],
    examples: [{ name: "docs", title: "A documentation's index", description: "Two groups, the current entry marked, the page numbers aligned." }],
  },
} satisfies ComponentMeta;
