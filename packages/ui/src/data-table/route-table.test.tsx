import { fireEvent, render, screen } from "@testing-library/react";

import { type RouteAdapter, RouteStateProvider } from "../router";
import { DataTable, type DataTableColumn } from "./index";
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
});
