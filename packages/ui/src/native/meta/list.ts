import type { ComponentMeta } from "../../meta";

export const meta = {
  title: "List",
  summary: "A long list, virtualised: rows or sections with sticky headings, pull to refresh, swipe actions, skeleton rows and an empty state.",
  status: "beta",
  category: "data-display",
  platforms: "native",
  whenToUse: ["Notifications grouped by day, messages, jobs, payouts.", "Any feed that loads by pages and refreshes with a pull."],
  whenNotToUse: [
    { when: "For records with several values to compare.", use: "data-table" },
    { when: "For a few settings: a column of rows is enough." },
  ],
  bestPractices: ["Use `ListItem` for rows: leading visual, title, one line, trailing detail.", "Show `loading` (skeletons) for the first page only; the next pages go in `footer` with a `Loader`.", "Give `empty` an `EmptyState` that says how to fill it."],
  accessibility: {
    keyboard: [],
    notes: ["Section headings are headings; rows that open something are buttons.", "Swipe actions are also accessibility actions."],
  },
  related: ["swipeable-row", "data-table", "empty-state", "pull-to-refresh"],
  native: {
    imports: ["List", "ListItem"],
    differences: [],
    examples: [
      { name: "notifications", title: "Notifications", description: "Sections by day, pull to refresh, swipe to delete." },
      { name: "loading", title: "Loading and empty", description: "Skeleton rows, then a bird when there is nothing." },
    ],
  },
} satisfies ComponentMeta;
