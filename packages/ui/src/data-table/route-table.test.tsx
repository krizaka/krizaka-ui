import { act, fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { type RouteAdapter, RouteStateProvider, useRouteState } from "../router";
import { navigateFrom } from "../router/route-state";
import { DataTable, type DataTableColumn, DataTableFilters } from "./index";
import { decodeFilter, decodeSort, encodeFilter, readTable, writeTable } from "./route-codec";

const defaults = { sort: { column: "name", direction: "ascending" as const }, page: 1 };

describe("the table in the address, pure", () => {
  it("reads defaults from an empty address and writes nothing for a default", () => {
    expect(readTable("", "t", defaults)).toEqual({ sort: defaults.sort, filters: {}, page: 1 });
    expect(writeTable("?a=1", "t", { sort: defaults.sort, page: 1 }, defaults)).toBe("?a=1");
  });

  it("round-trips a sort, a text filter, a facet, a range and a page, keeping other parameters", () => {
    const filters = { name: "lé a", kind: ["x", "y"], size: [1, null] } as never;
    const search = writeTable("?tab=2", "t", { sort: { column: "size", direction: "descending" }, filters, page: 3 }, defaults);
    expect(search).toContain("tab=2");
    expect(readTable(search, "t", defaults)).toEqual({ sort: { column: "size", direction: "descending" }, filters, page: 3 });
  });

  it("resets the page when the sort or the filters change, and says « no sort » apart from the default", () => {
    const at3 = writeTable("", "t", { page: 3 }, defaults);
    expect(readTable(writeTable(at3, "t", { filters: { name: "a" } }, defaults), "t", defaults).page).toBe(1);
    expect(decodeSort(writeTable("", "t", { sort: null }, defaults).split("=")[1] ?? null, defaults.sort)).toBeNull();
  });

  it("ignores a sort on an unknown column and a page that is not a number", () => {
    expect(readTable("?t.sort=ghost.ascending&t.page=x", "t", defaults, ["name"])).toMatchObject({ sort: defaults.sort, page: 1 });
    expect(decodeFilter(encodeFilter("[not json"))).toBe("[not json");
  });

  it("keeps a text that looks like JSON a text, and an escaped one too (review #524)", () => {
    for (const text of ["[1,2]", "[]", "\\x", "\\[1]"]) expect(decodeFilter(encodeFilter(text))).toBe(text);
    expect(decodeFilter(encodeFilter(["a", "b"]))).toEqual(["a", "b"]);
    const search = writeTable("", "t", { filters: { name: "[1,2]" } }, defaults);
    expect(readTable(search, "t", defaults).filters).toEqual({ name: "[1,2]" });
  });

  it("reads page 1 as page 1 when the default is another page (review #524)", () => {
    const at3 = { ...defaults, page: 3 };
    const first = writeTable("", "t", { page: 1 }, at3);
    expect(first).toBe("?t.page=1");
    expect(readTable(first, "t", at3).page).toBe(1);
    expect(readTable("?t.page=0", "t", at3).page).toBe(3);
  });

  it("starts from the table's default filters, and tells « cleared » apart from « the defaults » (review #524)", () => {
    const withFilters = { ...defaults, filters: { name: "a" } };
    expect(readTable("", "t", withFilters).filters).toEqual({ name: "a" });
    expect(writeTable("", "t", { filters: { name: "a" } }, withFilters)).toBe("");
    const cleared = writeTable("", "t", { filters: {} }, withFilters);
    expect(readTable(cleared, "t", withFilters).filters).toEqual({});
    expect(readTable(writeTable(cleared, "t", { filters: { name: "a" } }, withFilters), "t", withFilters).filters).toEqual({ name: "a" });
  });
});

type Row = { id: string; name: string };
const rows: Row[] = ["Béa", "Alma", "Cléo", "Dan"].map((name) => ({ id: name, name }));
const columns: DataTableColumn<Row>[] = [{ id: "name", header: "Name", sortable: true }];

function memoryAdapter(initial = ""): RouteAdapter & { current: () => string } {
  let search = initial;
  const listeners = new Set<() => void>();
  return {
    current: () => search,
    search: () => search,
    navigate: (next) => {
      search = next;
      listeners.forEach((l) => l());
    },
    subscribe: (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
  };
}

describe("DataTable routeKey", () => {
  it("sorts from the address, and a click on the header writes the new sort back to it", () => {
    const adapter = memoryAdapter("?t.sort=name.descending");
    render(
      <RouteStateProvider adapter={adapter}>
        <DataTable caption="People" routeKey="t" rows={rows} columns={columns} getRowId={(r) => r.id} />
      </RouteStateProvider>,
    );
    expect(screen.getAllByRole("row").slice(1).map((r) => r.textContent)).toEqual(["Dan", "Cléo", "Béa", "Alma"]);
    fireEvent.click(screen.getByRole("button", { name: /Name/ }));
    expect(adapter.current()).not.toContain("t.sort=name.descending");
  });

  it("pages from the address and writes the page asked for", () => {
    const adapter = memoryAdapter("?t.page=2");
    render(
      <RouteStateProvider adapter={adapter}>
        <DataTable caption="People" routeKey="t" pageSize={2} rows={rows} columns={columns} getRowId={(r) => r.id} />
      </RouteStateProvider>,
    );
    expect(screen.getAllByRole("row").slice(1).map((r) => r.textContent)).toEqual(["Cléo", "Dan"]);
  });

  it("goes back to page 1 in one navigation when the sort changes (review #524)", () => {
    const adapter = memoryAdapter("?t.page=2");
    const navigate = vi.spyOn(adapter, "navigate");
    render(
      <RouteStateProvider adapter={adapter}>
        <DataTable caption="People" routeKey="t" pageSize={2} rows={rows} columns={columns} getRowId={(r) => r.id} />
      </RouteStateProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: /Name/ }));
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(adapter.current()).not.toContain("t.page");
  });

  it("tells the server the query the address now shows, once, on back or forward and on a shared link (review #524)", () => {
    const adapter = memoryAdapter("?t.page=2");
    const onStateChange = vi.fn();
    render(
      <RouteStateProvider adapter={adapter}>
        <DataTable caption="People" routeKey="t" manual={{ sorting: true, filtering: true, pagination: true }} pageSize={2} rows={rows.slice(0, 2)} rowCount={4} columns={columns} getRowId={(r) => r.id} onStateChange={onStateChange} />
      </RouteStateProvider>,
    );
    expect(onStateChange).toHaveBeenCalledTimes(1);
    expect(onStateChange).toHaveBeenLastCalledWith(expect.objectContaining({ page: 2 }));
    act(() => adapter.navigate("?t.sort=name.descending", { replace: false }));
    expect(onStateChange).toHaveBeenCalledTimes(2);
    expect(onStateChange).toHaveBeenLastCalledWith(expect.objectContaining({ page: 1, sort: { column: "name", direction: "descending" } }));
  });

  it("keeps the search box in step with the address on back and forward (review #524)", () => {
    const adapter = memoryAdapter("?t.q.name=Alma");
    const filterable: DataTableColumn<Row>[] = [{ id: "name", header: "Name", filter: "text" }];
    render(
      <RouteStateProvider adapter={adapter}>
        <DataTable caption="People" routeKey="t" rows={rows} columns={filterable} getRowId={(r) => r.id} toolbar={<DataTableFilters debounce={0} />} />
      </RouteStateProvider>,
    );
    expect((screen.getByRole("searchbox") as HTMLInputElement).value).toBe("Alma");
    act(() => adapter.navigate("?t.q.name=Dan", { replace: false }));
    expect((screen.getByRole("searchbox") as HTMLInputElement).value).toBe("Dan");
  });
});

describe("writers of one router compose (review #524)", () => {
  it("builds each write on the last one, even before a slow router has applied it", () => {
    let applied = "";
    const listeners = new Set<() => void>();
    const slow: RouteAdapter = { search: () => applied, navigate: () => undefined, subscribe: (l) => (listeners.add(l), () => listeners.delete(l)) };
    navigateFrom(slow, (s) => writeTable(s, "a", { page: 2 }, defaults), { replace: false });
    navigateFrom(slow, (s) => writeTable(s, "b", { page: 3 }, defaults), { replace: false });
    const spy = vi.spyOn(slow, "navigate");
    navigateFrom(slow, (s) => `${s}&tab=x`, { replace: false });
    expect(spy).toHaveBeenLastCalledWith("?a.page=2&b.page=3&tab=x", { replace: false });
    applied = "?moved";
    listeners.forEach((l) => l());
    navigateFrom(slow, (s) => `${s}&y=1`, { replace: false });
    expect(spy).toHaveBeenLastCalledWith("?moved&y=1", { replace: false });
  });

  it("a route-bound tab and a table written in one event keep both", () => {
    const adapter = memoryAdapter("");
    let setTab: (v: "a" | "b") => void = () => undefined;
    function Tab() {
      const [, set] = useRouteState("tab", { values: ["a", "b"] as const, default: "a" });
      setTab = set;
      return null;
    }
    render(
      <RouteStateProvider adapter={adapter}>
        <Tab />
      </RouteStateProvider>,
    );
    act(() => {
      setTab("b");
      navigateFrom(adapter, (s) => writeTable(s, "t", { page: 2 }, defaults), { replace: false });
    });
    expect(adapter.current()).toBe("?tab=b&t.page=2");
  });
});
