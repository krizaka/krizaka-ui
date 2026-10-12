import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Virtual",
  summary: "Long lists and galleries rendered by what is in view, on TanStack Virtual: a list in its own region or the page's, a grid that fits the width, measured items, the end announced for infinite loading.",
  status: "beta",
  category: "data-display",
  platforms: "web",
  whenToUse: [
    "A list of hundreds to millions of items loaded at once or page by page: messages, comments, logs, notifications.",
    "A gallery that grows as the person scrolls: videos, photos, products (`VirtualGrid`).",
    "A feed that scrolls the page itself rather than a box (`scroll=\"window\"`).",
  ],
  whenNotToUse: [
    { when: "For records compared on columns: the data table has its own windowing.", use: "data-table" },
    { when: "For a short list (under a hundred items): render it whole, with no scrolling region.", use: "card-grid" },
    { when: "In a React Native app: FlashList, through the native list.", use: "list" },
  ],
  bestPractices: [
    "Give `getKey` (an id): measurements stay with their item when the list changes.",
    "Estimate the size close to the average (`estimateSize`): items are measured anyway, a close guess keeps the scrollbar steady.",
    "Load the next page in `onEndReached` (a `useInfiniteQuery` of @krizaka/query) and show a spinner in `footer`.",
    "Name the list (`label`): it names the focusable scrolling region, so keyboard people can scroll it.",
    "Need the raw engine? `useVirtualizer` and `useWindowVirtualizer` come through this entry — never import `@tanstack/*` in a product.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Reaches the scrolling region (then the links and buttons of the items in view)." },
      { keys: "Arrow keys", action: "Scroll the focused region; Page Up / Page Down and Home / End move by a screen or to the ends." },
    ],
    notes: [
      "The scrolling region is focusable (`tabIndex=0`) and named by `label`.",
      "Items are a `role=\"list\"` of `listitem`s carrying `aria-setsize` and `aria-posinset`: a screen reader says “item 4,812 of 50,000” though only twenty exist in the page.",
      "`scrollToIndex` (through `ref`) scrolls smoothly, or at once when the person asked for less motion.",
    ],
  },
  related: ["data-table", "list", "card", "spinner"],
  web: {
    imports: ["VirtualList", "VirtualGrid", "useWindowVirtualizer", "useVirtualizer"],
    examples: [
      { name: "messages", title: "50,000 messages", description: "A `VirtualList` of items of different heights, each measured." },
      { name: "gallery", title: "A gallery", description: "A `VirtualGrid` of 50,000 clips: as many columns as the width allows." },
      { name: "feed", title: "A feed", description: "`scroll=\"window\"`: the page scrolls, 20 more posts each time the end comes near." },
    ],
  },
} satisfies ComponentMeta;
