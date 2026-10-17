import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Tree view",
  summary: "A hierarchy the keyboard walks — the ARIA tree: one tab stop, the arrows move and open, a letter jumps, branches load on demand.",
  status: "deprecated",
  deprecated: {
    since: "3.6.0",
    removedIn: "4.0.0",
    use: "list",
    reason: "No product uses it and no planned work needs it: the documentation tree is Fumadocs' and the datasets screens drill down with a list.",
  },
  category: "navigation",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "Deprecated: no product uses it." }, desktop: { status: "n/a", reason: "Deprecated: no product uses it." } },
  whenToUse: ["The documentation's sections (krizaka.com/docs).", "A studio's datasets, folders of files."],
  whenNotToUse: [
    { when: "For two levels or fewer: a list with headings reads better.", use: "list" },
    { when: "On a phone: drill down screen by screen with a list.", use: "list" },
  ],
  bestPractices: ["Open the branch of the selected node at first (`defaultExpanded`).", "Load big branches on demand (`hasChildren` + `onLoadChildren`)."],
  accessibility: {
    keyboard: [
      { keys: "Arrow Down / Arrow Up", action: "Move to the next or previous visible node." },
      { keys: "Arrow Right", action: "Opens a closed branch, or moves to its first child." },
      { keys: "Arrow Left", action: "Closes an open branch, or moves to its parent." },
      { keys: "Home / End", action: "Move to the first or last visible node." },
      { keys: "Enter / Space", action: "Select the node (`onSelect`)." },
      { keys: "A letter", action: "Moves to the next node whose name starts with it." },
    ],
    notes: ["`tree`, `treeitem` and `group` with level, position and size; a loading branch is busy.", "Web only: a phone drills down with lists."],
  },
  related: ["list", "nav-bar"],
  web: {
    imports: ["TreeView"],
    examples: [
      { name: "docs", title: "Documentation", description: "Products, sections and pages, the current page selected." },
      { name: "lazy", title: "Loaded on demand", description: "A branch fetches its files when it opens." },
    ],
  },
} satisfies ComponentMeta;
