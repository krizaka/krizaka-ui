import type { ComponentMeta } from "../../meta";

export const meta = {
  title: "List",
  summary: "A long list for React Native on FlashList v2 — separators, skeleton rows, empty and error states, pull to refresh, the next page loaded near the end through useInfiniteQuery of @krizaka/query.",
  status: "beta",
  category: "data-display",
  platforms: "native",
  whenToUse: [
    "Any scrolling list of an app screen: notifications, messages, a feed, search results, payouts.",
    "A paginated API (`useInfiniteList`): one hook, one component — pages, refresh and errors handled.",
  ],
  whenNotToUse: [
    { when: "On the web: the virtual list, or the data table for columns.", use: "virtual" },
    { when: "For a few items that never scroll: lay them out in a View.", use: "card" },
  ],
  bestPractices: [
    "Give `keyExtractor` an id: FlashList recycles the views by it.",
    "Fetch with `useInfiniteList` (a `defineKeys` key, `krizakaFetch` in `queryFn`) and spread its `listProps` on `List`.",
    "Render `error` with an `ErrorState` and a retry; give `empty` its words (`{ title, description, action }`).",
    "Keep `renderItem` light (no state per item): views are recycled while the person scrolls.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "The list is named by `label`; while the first page loads it is `aria-busy` and its skeleton rows are hidden from assistive technology.",
      "An error is announced (`role=\"alert\"`); the spinner of the next page is named by `loadingMoreLabel`.",
      "Pull to refresh is the system's control (tinted with the theme); `onRefresh` should also be reachable from a button for switch and voice access.",
    ],
  },
  related: ["virtual", "empty-state", "skeleton", "spinner", "pagination"],
  native: {
    entry: "@krizaka/ui/native/list",
    imports: ["List", "useInfiniteList"],
    differences: [],
    examples: [
      { name: "default", title: "Default", description: "Notifications with avatars, separators inset after the avatar." },
      { name: "infinite", title: "Infinite", description: "`useInfiniteList` on a paginated API (faked here with `configureKrizakaFetch`): the next page near the end, pull to refresh." },
      { name: "states", title: "Loading and empty", description: "Skeleton rows while the first page loads; the empty state with what to do next." },
    ],
  },
} satisfies ComponentMeta;
