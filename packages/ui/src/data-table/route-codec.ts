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

// A text is written as typed, an array as JSON. A text that would read as JSON (it starts with `[`) or as an escaped one
// (`\`) is escaped with a leading backslash, so `"[1,2]"` typed in a text filter comes back as text, never as an array.
const ESCAPE = "\\";

export function encodeFilter(value: FilterValue): string {
  if (typeof value !== "string") return JSON.stringify(value);
  return value.startsWith("[") || value.startsWith(ESCAPE) ? `${ESCAPE}${value}` : value;
}

export function decodeFilter(raw: string): FilterValue {
  if (raw.startsWith(ESCAPE)) return raw.slice(1);
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
// Present (empty) when the filters were cleared while the table's defaults have some: « none » is not « the defaults ».
const clearedFilters = (key: string) => `${key}.q`;

/** The table's own starting state: what an address without its parameters means. */
export type RouteDefaults = { sort: RouteSort; page: number; filters?: DataTableFilterState };

const sameFilters = (a: DataTableFilterState, b: DataTableFilterState) => {
  const written = (f: DataTableFilterState) =>
    JSON.stringify(Object.entries(f).map(([column, value]) => [column, encodeFilter(value)]).filter(([, v]) => v !== "" && v !== "[]").sort(([a], [b]) => String(a).localeCompare(String(b))));
  return written(a) === written(b);
};

export function readTable(search: string, key: string, defaults: RouteDefaults, columns?: readonly string[]) {
  const params = new URLSearchParams(search);
  const filters: Record<string, FilterValue> = {};
  let explicit = params.has(clearedFilters(key));
  for (const [name, raw] of params) {
    if (!name.startsWith(filterPrefix(key)) || raw === "") continue;
    explicit = true;
    filters[name.slice(filterPrefix(key).length)] = decodeFilter(raw);
  }
  const raw = params.get(`${key}.page`);
  const page = raw !== null && /^[1-9]\d*$/.test(raw) ? Number(raw) : defaults.page;
  return {
    sort: decodeSort(params.get(`${key}.sort`), defaults.sort, columns),
    filters: (explicit ? filters : (defaults.filters ?? {})) as DataTableFilterState,
    page,
  };
}

type Change = { sort?: RouteSort; filters?: DataTableFilterState; page?: number };

/** Replaces the table's filter parameters: none when they equal the defaults, a marker when they were all cleared. */
function writeFilters(params: URLSearchParams, key: string, filters: DataTableFilterState, defaults: RouteDefaults): void {
  for (const name of [...params.keys()]) if (name.startsWith(filterPrefix(key)) || name === clearedFilters(key)) params.delete(name);
  if (sameFilters(filters, defaults.filters ?? {})) return;
  let written = 0;
  for (const [column, value] of Object.entries(filters)) {
    const encoded = encodeFilter(value);
    if (encoded === "" || encoded === "[]") continue;
    params.set(`${filterPrefix(key)}${column}`, encoded);
    written += 1;
  }
  if (written === 0) params.set(clearedFilters(key), "");
}

/**
 * The query string with the table's parameters changed; every other parameter is kept. A change of sort or filters goes
 * back to the first page (as the table does) unless it says otherwise; a value equal to the default is not written.
 */
export function writeTable(search: string, key: string, change: Change, defaults: RouteDefaults): string {
  const params = new URLSearchParams(search);
  if (change.sort !== undefined) {
    if (sameSort(change.sort, defaults.sort)) params.delete(`${key}.sort`);
    else params.set(`${key}.sort`, encodeSort(change.sort));
  }
  if (change.filters !== undefined) writeFilters(params, key, change.filters, defaults);
  const page = change.page ?? (change.sort !== undefined || change.filters !== undefined ? 1 : undefined);
  if (page !== undefined) {
    if (page === defaults.page) params.delete(`${key}.page`);
    else params.set(`${key}.page`, String(page));
  }
  const text = params.toString();
  return text ? `?${text}` : "";
}
