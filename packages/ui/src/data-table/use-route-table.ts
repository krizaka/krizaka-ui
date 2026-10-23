"use client";
import * as React from "react";

import { useRouteSearch } from "../router";
import type { DataTableFilterState } from "./engine";
import { decodeSort, encodeSort, readTable, type RouteSort, writeTable } from "./route-codec";

/** `DataTable`'s `routeKey`: the sort, the filters and the page read from the address, and written to it. Inert without a key. */
export function useRouteTable(routeKey: string | undefined, defaults: { sort: RouteSort; page: number }, columns: readonly string[]) {
  const { search, write } = useRouteSearch();
  const key = routeKey;
  const sortKey = encodeSort(defaults.sort);
  const columnKey = columns.join();
  const page = defaults.page;
  // Stable between renders while the address is the same: the table's filters are compared by identity.
  const table = React.useMemo(
    () => (key === undefined ? null : readTable(search, key, { sort: decodeSort(sortKey, null), page }, columnKey.split(","))),
    [search, key, sortKey, columnKey, page],
  );
  if (key === undefined || table === null) return null;
  return {
    sort: table.sort,
    filters: table.filters,
    page: table.page,
    // Typing in a filter is not a place to come back to: it replaces the entry; a sort or a page is a step.
    onSortChange: (sort: RouteSort) => write((s) => writeTable(s, key, { sort }, defaults)),
    onFiltersChange: (filters: DataTableFilterState) => write((s) => writeTable(s, key, { filters }, defaults), { replace: true }),
    onPageChange: (page: number) => write((s) => writeTable(s, key, { page }, defaults)),
  };
}
