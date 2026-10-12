---
name: krizaka-virtual
description: Long lists, feeds and galleries in a Krizaka web app with @krizaka/ui/virtual (TanStack Virtual v3 behind the Krizaka facade) — VirtualList (own region or window scroll, measured items), VirtualGrid (responsive columns), infinite loading with @krizaka/query. Use it before rendering more than ~100 items, an infinite feed or a gallery.
---

# @krizaka/ui/virtual

## Rules

1. Import from `@krizaka/ui/virtual` — **never `@tanstack/react-virtual`**, `react-window` or `react-virtualized`.
   The raw hooks come through the facade: `useVirtualizer`, `useWindowVirtualizer`.
2. Records compared on columns → `@krizaka/ui/data-table` (`virtualized`), not a list. React Native → `@krizaka/ui/native/list`.
3. Always `getKey` (an id) and a `label` (translated): it names the focusable scrolling region.

## Recipes

```tsx
// Messages of different heights, in their own region
<VirtualList items={messages} getKey={(m) => m.id} estimateSize={64} gap={8} height={480} label={t.chat.messages}
  renderItem={(m) => <MessageBubble message={m} />} />

// A feed that scrolls the page, infinite with @krizaka/query
const feed = useInfiniteQuery({ ...feedQuery(), meta: { list: true } });
const posts = useMemo(() => feed.data?.pages.flatMap((p) => p.items) ?? NONE, [feed.data]);
<VirtualList scroll="window" items={posts} getKey={(p) => p.id} estimateSize={320} label={t.feed.title}
  onEndReached={() => feed.hasNextPage && !feed.isFetchingNextPage && feed.fetchNextPage()}
  footer={feed.isFetchingNextPage ? <Spinner label={t.common.loadingMore} /> : null} renderItem={(p) => <Post post={p} />} />

// A gallery: as many columns as fit (or `columns={4}`)
<VirtualGrid items={videos} getKey={(v) => v.id} estimateRowHeight={260} minItemWidth={220} label={t.explore.videos}
  renderItem={(v) => <VideoCard video={v} />} />
```

`ref` gives `scrollToIndex(i, align)` — smooth, or instant under reduced motion. Items are `listitem`s with
`aria-setsize` / `aria-posinset`.
