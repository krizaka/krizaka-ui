// The table's sort, filters and page as search parameters: pure, so the address and the tests share them. With
// `routeKey="clients"` the address reads `?clients.sort=visits.descending&clients.q.client=lea&clients.page=2`; a value equal to
// the table's own default is not written (a clean URL).
import type { DataTableFilterState, FilterValue } from "./engine";

export type RouteSort = { column: string; direction: "ascending" | "descending" } | null;

const NONE = "none";

export function encodeSort(sort: RouteSort): string {
  return sort ? `${sort.column}.${sort.direction}` : NONE;
}

export function decodeSort(raw: string | null, fallback: RouteSort, columns?: readonly string[]): RouteSort {
  if (raw === null) return fallback;
  if (raw === NONE) return null;
  const dot = raw.lastIndexOf(".");
  const column = raw.slice(0, dot);
  const direction = raw.slice(dot + 1);
  if (dot < 1 || (direction !== "ascending" && direction !== "descending") || (columns && !columns.includes(column))) return fallback;
  return { column, direction };
}

export function encodeFilter(value: FilterValue): string {
  return typeof value === "string" ? value : JSON.stringify(value);
}

export function decodeFilter(raw: string): FilterValue {
  if (raw.startsWith("[")) {
    try {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as FilterValue;
    } catch {
      // a text that merely starts with a bracket
    }
  }
  return raw;
}

const sameSort = (a: RouteSort, b: RouteSort) => a?.column === b?.column && a?.direction === b?.direction;
const filterPrefix = (key: string) => `${key}.q.`;

export function readTable(search: string, key: string, defaults: { sort: RouteSort; page: number }, columns?: readonly string[]) {
  const params = new URLSearchParams(search);
  const filters: Record<string, FilterValue> = {};
  for (const [name, raw] of params) if (name.startsWith(filterPrefix(key)) && raw !== "") filters[name.slice(filterPrefix(key).length)] = decodeFilter(raw);
  const page = Number.parseInt(params.get(`${key}.page`) ?? "", 10);
  return { sort: decodeSort(params.get(`${key}.sort`), defaults.sort, columns), filters: filters as DataTableFilterState, page: Number.isInteger(page) && page > 1 ? page : defaults.page };
}

type Change = { sort?: RouteSort; filters?: DataTableFilterState; page?: number };

/** The query string with the table's parameters changed; every other parameter is kept. A change of sort or filters resets the page unless it says otherwise. */
export function writeTable(search: string, key: string, change: Change, defaults: { sort: RouteSort; page: number }): string {
  const params = new URLSearchParams(search);
  if (change.sort !== undefined) {
    if (sameSort(change.sort, defaults.sort)) params.delete(`${key}.sort`);
    else params.set(`${key}.sort`, encodeSort(change.sort));
  }
  if (change.filters !== undefined) {
    for (const name of [...params.keys()]) if (name.startsWith(filterPrefix(key))) params.delete(name);
    for (const [column, value] of Object.entries(change.filters)) {
      const encoded = encodeFilter(value);
      if (encoded !== "" && encoded !== "[]") params.set(`${filterPrefix(key)}${column}`, encoded);
    }
  }
  const page = change.page ?? (change.sort !== undefined || change.filters !== undefined ? defaults.page : undefined);
  if (page !== undefined) {
    if (page === defaults.page) params.delete(`${key}.page`);
    else params.set(`${key}.page`, String(page));
  }
  const text = params.toString();
  return text ? `?${text}` : "";
}
