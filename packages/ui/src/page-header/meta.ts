import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Page header",
  summary: "The top of a page: a breadcrumb, the title, a description and the page's actions.",
  status: "stable",
  category: "layout",
  platforms: "web",
  whenToUse: ["At the top of every page of an app: settings, dashboards, lists.", "With `actions` for what applies to the whole page: export, create, withdraw."],
  whenNotToUse: [
    { when: "For the hero of a marketing page: compose it with the brand backdrop.", use: "section-backdrop" },
    { when: "For the title of a dialog.", use: "dialog" },
  ],
  bestPractices: [
    "One page header per page, and its title is the page's only `h1` (`as=\"h2\"` for a section that looks like one).",
    "One primary action at most in `actions`.",
    "The breadcrumb is a slot: pass your own `<nav aria-label=\"Breadcrumb\">` with router links.",
  ],
  accessibility: {
    keyboard: [],
    notes: ["The title is an `h1` by default: the page's main heading.", "In the breadcrumb, mark the current page with `aria-current=\"page\"`."],
  },
  related: ["button", "dropdown-menu", "tabs"],
  web: {
    imports: ["PageHeader"],
    examples: [
      { name: "default", title: "Default", description: "A title and a description." },
      { name: "with-actions", title: "With actions", description: "The page's actions on the right." },
      { name: "with-breadcrumb", title: "With a breadcrumb", description: "The product's own breadcrumb above the title." },
    ],
  },
} satisfies ComponentMeta;
