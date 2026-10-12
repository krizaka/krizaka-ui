---
name: krizaka-native-list
description: Lists in a Krizaka React Native / Expo app with @krizaka/ui/native/list — List on FlashList v2 (separators, skeleton rows, empty/error states, pull to refresh, spinner for the next page) and useInfiniteList (useInfiniteQuery of @krizaka/query wired to onEndReached). Use it instead of FlatList, ScrollView+map or a direct @shopify/flash-list import.
---

# @krizaka/ui/native/list

## Rules

1. Import `List` and `useInfiniteList` from `@krizaka/ui/native/list` — not `FlatList`, not `@shopify/flash-list`
   directly. The app installs the optional peers: `@shopify/flash-list` (v2) and `@krizaka/query`.
2. Server data goes through `@krizaka/query` (never `@tanstack/react-query`): one `KrizakaQueryProvider` at the root.
3. `keyExtractor` returns an id; `renderItem` stays light (views are recycled); words are passed translated.

## Recipes

```tsx
// A paginated API
const { listProps, error } = useInfiniteList({
  queryKey: notificationKeys.list(),
  queryFn: ({ pageParam, signal }) => krizakaFetch("/api/notifications", { schema: NotificationPage, query: { cursor: pageParam }, signal }),
  initialPageParam: null as string | null,
  getNextPageParam: (last) => last.nextCursor,
  getItems: (page) => page.items,
});
return (
  <List label={t.notifications.title} {...listProps} keyExtractor={(n) => n.id} separator="inset"
    renderItem={(n) => <NotificationRow notification={n} />}
    error={error ? <ErrorState title={t.errors.load} action={…} /> : undefined}
    empty={{ title: t.notifications.empty, description: t.notifications.emptyHint }}
    loadingMoreLabel={t.common.loadingMore} />
);

// Static data
<List label={t.settings.devices} data={devices} keyExtractor={(d) => d.id} renderItem={(d) => <DeviceRow device={d} />} />
```

`listProps` = `{ data, loading, refreshing, onRefresh, onEndReached, loadingMore }`: the next page is asked once at a
time and never past the last; pull to refresh refetches every loaded page.
