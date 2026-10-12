// @krizaka/ui/native/list — its own entry, because it imports FlashList v2 (@shopify/flash-list) and @krizaka/query:
// optional peers, installed only by the apps that list. The theme and the states come from @krizaka/ui/native (one
// theme context); the server state comes from @krizaka/query (one QueryClient context — never @tanstack/* here).
import { type InfiniteData, useInfiniteQuery, type UseInfiniteQueryResult } from "@krizaka/query";
import { EmptyState, Skeleton, Spinner, useTheme } from "@krizaka/ui/native";
import { FlashList, type FlashListRef } from "@shopify/flash-list";
import * as React from "react";
import { RefreshControl, type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

export type ListProps<T> = {
  /** The items (stable: a query's data, state). */
  data: readonly T[];
  /** Draws one item. */
  renderItem: (item: T, index: number) => React.ReactElement | null;
  /** A stable key per item (an id): FlashList recycles the views by it. */
  keyExtractor: (item: T, index: number) => string;
  /** The accessible name of the list ("Notifications"), passed translated. */
  label: string;
  /** A hairline between items: `full` (default), `inset` (aligned with the text after an avatar), `none`. */
  separator?: "full" | "inset" | "none";
  /** The first page is loading: skeleton rows (`loadingRows` of them) in place of the items. */
  loading?: boolean;
  /** How many skeleton rows while loading. Default 6. */
  loadingRows?: number;
  /** A failure, shown in place of the items (an `ErrorState` with a retry). */
  error?: React.ReactNode;
  /** Shown when there is no item (an `EmptyState`, or its words: `{ title, description, action }`). */
  empty?: React.ReactNode | { title: string; description?: string; action?: React.ReactNode };
  /** The list is reloading after a pull: the system's spinner at the top. */
  refreshing?: boolean;
  /** Pull to refresh: called when the person pulls the list down. */
  onRefresh?: () => void;
  /** Called when the end comes near: load the next page. */
  onEndReached?: () => void;
  /** How far from the end `onEndReached` fires, in screens. Default 0.5. */
  endReachedThreshold?: number;
  /** The next page is loading: a spinner under the last item, named by `loadingMoreLabel`. */
  loadingMore?: boolean;
  /** The name of that spinner ("Loading more"), passed translated. */
  loadingMoreLabel?: string;
  /** Above the first item (a title, filters): scrolls with the list. */
  header?: React.ReactElement;
  /** Under the last item. */
  footer?: React.ReactElement;
  /** Extra data the items depend on (a selection): a change re-renders the visible items. */
  extraData?: unknown;
  /** The FlashList, for `scrollToIndex` / `scrollToOffset`. */
  ref?: React.Ref<FlashListRef<T>>;
  /** Styles of the list's content (padding). */
  contentContainerStyle?: StyleProp<ViewStyle>;
  /** Styles merged last, on the list. */
  style?: StyleProp<ViewStyle>;
};

function SkeletonRow() {
  return (
    <View style={styles.skeleton} aria-hidden>
      <Skeleton shape="circle" width={40} height={40} />
      <View style={styles.skeletonText}>
        <Skeleton width="60%" />
        <Skeleton width="35%" />
      </View>
    </View>
  );
}

const isWords = (value: unknown): value is { title: string; description?: string; action?: React.ReactNode } =>
  typeof value === "object" && value !== null && !React.isValidElement(value) && "title" in value;

/**
 * A long list on FlashList v2 (recycled views, 60 fps): separators, skeleton rows while the first page loads, an empty
 * or error state in place of the items, pull to refresh tinted with the theme, the next page asked for near the end and
 * a spinner under the last item. With `useInfiniteList`, a paginated API is one hook and one component.
 */
export function List<T>({
  data,
  renderItem,
  keyExtractor,
  label,
  separator = "full",
  loading,
  loadingRows = 6,
  error,
  empty,
  refreshing = false,
  onRefresh,
  onEndReached,
  endReachedThreshold = 0.5,
  loadingMore,
  loadingMoreLabel = "Loading more",
  header,
  footer,
  extraData,
  ref,
  contentContainerStyle,
  style,
}: ListProps<T>) {
  const { theme } = useTheme();
  const Separator = React.useMemo(
    () =>
      separator === "none"
        ? undefined
        : function ListSeparator() {
            return <View style={[styles.separator, { backgroundColor: theme.borderSubtle }, separator === "inset" && styles.inset]} />;
          },
    [separator, theme.borderSubtle],
  );

  if (loading) {
    return (
      <View role="group" style={[styles.fill, style]} aria-busy accessibilityLabel={label}>
        {header}
        {Array.from({ length: loadingRows }, (_, i) => (
          <React.Fragment key={i}>
            {i > 0 && Separator ? <Separator /> : null}
            <SkeletonRow />
          </React.Fragment>
        ))}
      </View>
    );
  }

  const state = error ? (
    <View role="alert" style={styles.state}>
      {error}
    </View>
  ) : isWords(empty) ? (
    <EmptyState title={empty.title} description={empty.description} action={empty.action} style={styles.state} />
  ) : empty ? (
    <View style={styles.state}>{empty}</View>
  ) : null;

  return (
    <FlashList
      ref={ref}
      accessibilityLabel={label}
      // Reachable from a keyboard (a hardware keyboard, the web): a scrolling area takes the focus to be scrolled.
      focusable
      data={error ? [] : data}
      renderItem={({ item, index }) => renderItem(item, index)}
      keyExtractor={keyExtractor}
      extraData={extraData}
      ItemSeparatorComponent={Separator}
      ListHeaderComponent={header}
      ListEmptyComponent={state}
      ListFooterComponent={
        loadingMore || footer ? (
          <View>
            {loadingMore ? (
              <View style={styles.more}>
                <Spinner label={loadingMoreLabel} />
              </View>
            ) : null}
            {footer}
          </View>
        ) : null
      }
      onEndReached={onEndReached}
      onEndReachedThreshold={endReachedThreshold}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.accent} colors={[theme.accent]} progressBackgroundColor={theme.surface1} />
        ) : undefined
      }
      contentContainerStyle={contentContainerStyle as never}
      style={style}
    />
  );
}

export type InfiniteListOptions<TPage, TItem, TParam> = {
  /** The query key (a `defineKeys` key): one cache entry for every page. */
  queryKey: readonly unknown[];
  /** Fetches one page (`krizakaFetch`), from its page parameter (a cursor, a page number). */
  queryFn: (context: { pageParam: TParam; signal: AbortSignal }) => Promise<TPage>;
  /** The parameter of the first page (`null` for a cursor, `1` for numbers). */
  initialPageParam: TParam;
  /** The parameter of the page after `lastPage`, or `undefined` / `null` when there is none. */
  getNextPageParam: (lastPage: TPage, pages: TPage[]) => TParam | undefined | null;
  /** The items of a page (`(page) => page.items`). */
  getItems: (page: TPage) => readonly TItem[];
  /** `false` to wait (a missing id). Default `true`. */
  enabled?: boolean;
  /** How long a page stays fresh, in ms (the client's default otherwise). */
  staleTime?: number;
};

/** What `useInfiniteList` gives: the props of `List` to spread, and the query itself. */
export type InfiniteListResult<TPage, TItem, TParam = unknown> = {
  /** `{ data, loading, refreshing, onRefresh, onEndReached, loadingMore }` — spread on `<List>`. */
  listProps: Pick<ListProps<TItem>, "data" | "loading" | "refreshing" | "onRefresh" | "onEndReached" | "loadingMore">;
  /** The failure of the first page, if any: render an `ErrorState` in `error` (a later page's failure keeps the list). */
  error: Error | null;
  /** The query of @krizaka/query (`refetch`, `status`, the pages…). */
  query: UseInfiniteQueryResult<InfiniteData<TPage, TParam>, Error>;
};

/**
 * A paginated API as a list: `useInfiniteQuery` of @krizaka/query (a list: `meta: { list: true }`, so an error stays in
 * the list), the pages flattened, the next page asked for by `onEndReached` (once at a time, only when there is one),
 * pull to refresh — spread `listProps` on `<List>`.
 */
export function useInfiniteList<TPage, TItem, TParam = unknown>({
  queryKey,
  queryFn,
  initialPageParam,
  getNextPageParam,
  getItems,
  enabled,
  staleTime,
}: InfiniteListOptions<TPage, TItem, TParam>): InfiniteListResult<TPage, TItem, TParam> {
  const query = useInfiniteQuery<TPage, Error, InfiniteData<TPage, TParam>, readonly unknown[], TParam>({
    queryKey,
    queryFn: ({ pageParam, signal }) => queryFn({ pageParam: pageParam as TParam, signal }),
    initialPageParam,
    getNextPageParam: (last, pages) => getNextPageParam(last, pages) ?? undefined,
    enabled,
    staleTime,
    meta: { list: true },
  });
  const [pulled, setPulled] = React.useState(false);
  const { data: pages, hasNextPage, isFetchingNextPage, fetchNextPage, refetch, isPending, isError, isRefetching } = query;
  // eslint-disable-next-line react-hooks/exhaustive-deps -- `getItems` is a projection; the pages decide
  const data = React.useMemo(() => (pages?.pages ?? []).flatMap((page) => getItems(page)), [pages]);
  return {
    listProps: {
      data,
      loading: isPending && enabled !== false,
      refreshing: pulled && isRefetching,
      onRefresh: () => {
        setPulled(true);
        void refetch().finally(() => setPulled(false));
      },
      onEndReached: () => {
        if (hasNextPage && !isFetchingNextPage && !isError) void fetchNextPage();
      },
      loadingMore: isFetchingNextPage,
    },
    error: isError && !pages ? query.error : null,
    query,
  };
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  separator: { height: StyleSheet.hairlineWidth },
  inset: { marginLeft: 68 },
  skeleton: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 14 },
  skeletonText: { flex: 1, gap: 8 },
  state: { paddingHorizontal: 16, paddingVertical: 32 },
  more: { paddingVertical: 20, alignItems: "center" },
});
