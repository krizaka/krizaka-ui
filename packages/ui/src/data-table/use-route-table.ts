"use client";
import * as React from "react";

import { useRouteSearch } from "../router";
import type { DataTableFilterState } from "./engine";
import { decodeSort, encodeSort, readTable, type RouteDefaults, type RouteSort, writeTable } from "./route-codec";

/** `DataTable`'s `routeKey`: the sort, the filters and the page read from the address, and written to it. Inert without a key. */
export function useRouteTable(routeKey: string | undefined, defaults: Required<RouteDefaults>, columns: readonly string[]) {
  const { search, write } = useRouteSearch();
  const key = routeKey;
  // The defaults by value: a table's `defaultFilters={{…}}` is a new object at each render.
  const sortKey = encodeSort(defaults.sort);
  const filtersKey = JSON.stringify(defaults.filters);
  const columnKey = columns.join();
  const page = defaults.page;
  const stable = React.useMemo<Required<RouteDefaults>>(
    () => ({ sort: decodeSort(sortKey, null), page, filters: JSON.parse(filtersKey) as DataTableFilterState }),
    [sortKey, filtersKey, page],
  );
  // Stable between renders while the address is the same: the table's filters are compared by identity.
  const table = React.useMemo(
    () => (key === undefined ? null : readTable(search, key, stable, columnKey.split(","))),
    [search, key, stable, columnKey],
  );
  if (key === undefined || table === null) return null;
  return {
    sort: table.sort,
    filters: table.filters,
    page: table.page,
    // Typing in a filter is not a place to come back to: it replaces the entry; a sort or a page is a step. A sort or a
    // filter goes back to the first page in the same navigation.
    onSortChange: (sort: RouteSort) => write((s) => writeTable(s, key, { sort }, stable)),
    onFiltersChange: (filters: DataTableFilterState) => write((s) => writeTable(s, key, { filters }, stable), { replace: true }),
    onPageChange: (next: number) => write((s) => writeTable(s, key, { page: next }, stable)),
  };
}
