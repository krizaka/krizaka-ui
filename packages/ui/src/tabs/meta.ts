import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Tabs",
  summary: "Views of the same page, one at a time: underlined sections, a segmented switch or pills — one light glides from the active tab to the next, in every variant.",
  status: "beta",
  category: "navigation",
  platforms: "both",
  parity: { desktop: "web" },
  whenToUse: [
    "To split a page into sections the user switches between without leaving it: videos, stories, about.",
    "`variant=\"segmented\"` for a view switch (grid, list); `pills` for a feed's sections.",
  ],
  whenNotToUse: [
    { when: "For a filter that narrows a list.", use: "chip" },
    { when: "To go to other pages from a tablist: use `Tabs.Nav` (links), not `Tabs.Trigger`." },
    { when: "For a choice in a form.", use: "radio-group" },
  ],
  bestPractices: [
    "Short labels of one or two words; the active one should be clear without colour.",
    "Keep the URL in sync with the active tab when a tab is worth sharing: better, use `Tabs.Nav` (tabs as routes), where the route is the state and the active tab is read from it.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Moves to the active tab, then into its panel." },
      { keys: "Arrow keys / Home / End", action: "Move between tabs and activate them." },
    ],
    notes: [
      "Radix Tabs: `tablist`, `tab` with `aria-selected` and `aria-controls`, `tabpanel`; name the list with `aria-label`.",
      "A disabled tab is skipped.",
    ],
  },
  related: ["chip", "segmented", "radio-group"],
  web: {
    imports: ["Tabs"],
    examples: [
      { name: "underline", title: "Underline", description: "The sections of a page; a disabled tab is skipped." },
      { name: "segmented", title: "Segmented", description: "A view switch: equal segments in a track." },
      { name: "pills", title: "Pills", description: "A feed's sections, scrolling sideways on a phone." },
      { name: "vertical", title: "Vertical", description: "`orientation=\"vertical\"`: the list on the side." },
      { name: "routes", title: "Tabs as routes", description: "`Tabs.Nav` + `Tabs.NavLink`: each tab is a link, the active one comes from the current route (`aria-current=\"page\"`), the URL is the state." },
    ],
  },
  native: {
    imports: ["Tabs"],
    differences: [
      "`items` (value, label, count, content) instead of the web's parts.",
      "The underlined tab list scrolls sideways when it does not fit; for the app's main sections use `TabBar`.",
    ],
    examples: [
      { name: "sections", title: "Sections", description: "A creator's page: underlined tabs with counts." },
      { name: "segmented", title: "Segmented", description: "Two views of the same content." },
    ],
  },
} satisfies ComponentMeta;
