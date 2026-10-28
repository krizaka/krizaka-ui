import type { ComponentMeta } from "../meta";

export const meta = {
  title: "List",
  summary: "Records read top to bottom — a leading visual, a title and a line, details and actions beside — dense or comfortable, selectable, windowed when long.",
  status: "beta",
  category: "data-display",
  domain: "data-display",
  platforms: "both",
  parity: { desktop: "web" },
  whenToUse: [
    "Orazaka's jobs, a story's viewers and tippers, a creator's payouts.",
    "A long feed on a phone: sections by day, pull to refresh, swipe actions (React Native).",
  ],
  whenNotToUse: [
    { when: "For records with several values to compare side by side.", use: "data-table" },
    { when: "For what happened over time.", use: "activity-feed" },
    { when: "For facts about one thing.", use: "description-list" },
  ],
  bestPractices: [
    "One main action per row (a link or `onSelect`); secondary actions go in `actions`, beside it.",
    "Show `loading` for the first page only; the next pages go in `footer` (a “Load more” button, a `Pagination`).",
    "Past a few hundred rows, `virtualize` with a fixed row height.",
  ],
  accessibility: {
    keyboard: [{ keys: "Tab", action: "Moves through the rows' main actions, their checkboxes and their secondary actions." }],
    notes: [
      "A `ul` named by `aria-label`; the main action fills the row without nesting the others.",
      "A windowed list is a scrolling region the keyboard can reach.",
      "On React Native, swipe actions are also accessibility actions.",
    ],
  },
  related: ["data-table", "activity-feed", "description-list"],
  web: {
    imports: ["List"],
    examples: [
      { name: "jobs", title: "Jobs", description: "Orazaka's jobs, each row opening its run, the status beside it." },
      { name: "selectable", title: "Selectable, compact", description: "A story's viewers, picked for a thank-you." },
      { name: "virtualized", title: "2,000 rows", description: "`virtualize`: only the rows in view are rendered." },
    ],
  },
  native: {
    entry: "@krizaka/ui/native/list",
    imports: ["List", "useInfiniteList"],
    differences: [
      "Its own entry, `@krizaka/ui/native/list` (FlashList, an optional peer); rows are rendered by `renderItem`, not described by `row`.",
      "`useInfiniteList` loads the next page near the end and refreshes on a pull, through @krizaka/query.",
    ],
    examples: [
      { name: "default", title: "Default", description: "Notifications with avatars, separators inset after the avatar." },
      { name: "infinite", title: "Infinite", description: "`useInfiniteList` on a paginated API (faked here with `configureKrizakaFetch`): the next page near the end, pull to refresh." },
      { name: "states", title: "Loading and empty", description: "Skeleton rows while the first page loads; the empty state with what to do next." },
    ],
  },
} satisfies ComponentMeta;
