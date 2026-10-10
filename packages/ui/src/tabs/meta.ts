import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Tabs",
  summary: "Views of the same page, one at a time: underlined sections, a segmented switch or pills.",
  status: "beta",
  category: "navigation",
  platforms: "web",
  whenToUse: [
    "To split a page into sections the user switches between without leaving it: videos, stories, about.",
    "`variant=\"segmented\"` for a view switch (grid, list); `pills` for a feed's sections.",
  ],
  whenNotToUse: [
    { when: "For a filter that narrows a list.", use: "chip" },
    { when: "To go to other pages: use links in the navigation." },
    { when: "For a choice in a form.", use: "radio-group" },
  ],
  bestPractices: [
    "Short labels of one or two words; the active one should be clear without colour.",
    "Keep the URL in sync with the active tab when a tab is worth sharing.",
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
    ],
  },
} satisfies ComponentMeta;
