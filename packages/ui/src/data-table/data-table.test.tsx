import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { axeViolations } from "../test/axe";
import {
  compareValues,
  DataTable,
  type DataTableColumn,
  DataTableColumnsMenu,
  dataTableCsv,
  DataTableExport,
  DataTableFilters,
  type DataTableQuery,
  useDataTable,
} from "./index";

type Row = { id: string; name: string; views: number; status: "live" | "draft"; tips?: number };
const rows: Row[] = [
  { id: "a", name: "Beta", views: 30, status: "live", tips: 4 },
  { id: "b", name: "Alpha", views: 120, status: "draft", tips: 10 },
  { id: "c", name: "Gamma", views: 5, status: "live" },
];
const columns: DataTableColumn<Row>[] = [
  { id: "name", header: "Name", sortable: true, card: "title", filter: "text" },
  { id: "status", header: "Status", filter: "facet", groupable: true, options: [{ value: "live", label: "Live" }, { value: "draft", label: "Draft" }] },
  { id: "views", header: "Views", sortable: true, align: "end", filter: "range", aggregate: (group) => group.reduce((sum, r) => sum + r.views, 0) },
];
const bodyRows = () => screen.getAllByRole("row").slice(1);
const names = () => bodyRows().map((row) => within(row).getAllByRole("cell")[0]?.textContent);

describe("DataTable v2 — the table", () => {
  it("is a captioned table with column headers, with no axe violation", async () => {
    const { container } = render(<DataTable caption="Videos" rows={rows} columns={columns} getRowId={(r) => r.id} selectable rowLabel={(r) => r.name} />);
    expect(screen.getByRole("table", { name: "Videos" })).toBeTruthy();
    expect(screen.getAllByRole("columnheader")).toHaveLength(4);
    expect(screen.getAllByRole("cell")[1]?.getAttribute("data-label")).toBe("Name");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("sorts ascending, descending, then back, says so with aria-sort, and keeps empty values last", async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    render(<DataTable caption="Videos" rows={rows} columns={columns} getRowId={(r) => r.id} onSortChange={onSortChange} />);
    const header = screen.getByRole("columnheader", { name: /Views/ });
    expect(header.getAttribute("aria-sort")).toBe("none");
    await user.click(within(header).getByRole("button"));
    expect(header.getAttribute("aria-sort")).toBe("ascending");
    expect(names()).toEqual(["Gamma", "Beta", "Alpha"]);
    expect(onSortChange).toHaveBeenLastCalledWith({ column: "views", direction: "ascending" });
    await user.click(within(header).getByRole("button"));
    expect(header.getAttribute("aria-sort")).toBe("descending");
    expect(names()).toEqual(["Alpha", "Beta", "Gamma"]);
    await user.click(within(header).getByRole("button"));
    expect(onSortChange).toHaveBeenLastCalledWith(null);
    expect(compareValues(null, 3)).toBe(1);
    expect(compareValues("item 2", "item 10")).toBeLessThan(0);
  });

  it("selects rows one by one and all at once, from the keyboard", async () => {
    const user = userEvent.setup();
    const onSelectedChange = vi.fn();
    render(<DataTable caption="Videos" rows={rows} columns={columns} getRowId={(r) => r.id} selectable rowLabel={(r) => r.name} onSelectedChange={onSelectedChange} />);
    screen.getByRole("checkbox", { name: "Select Alpha" }).focus();
    await user.keyboard(" ");
    expect(onSelectedChange).toHaveBeenLastCalledWith(["b"]);
    expect(screen.getByRole("checkbox", { name: "Select all rows" }).getAttribute("aria-checked")).toBe("mixed");
    await user.click(screen.getByRole("checkbox", { name: "Select all rows" }));
    expect(onSelectedChange).toHaveBeenLastCalledWith(["b", "a", "c"]);
    expect(bodyRows().every((row) => row.getAttribute("data-state") === "selected")).toBe(true);
  });

  it("shows loading, empty and error states", () => {
    const { rerender } = render(<DataTable caption="Videos" rows={[]} columns={columns} getRowId={(r) => r.id} loading />);
    expect(screen.getByRole("table").getAttribute("aria-busy")).toBe("true");
    rerender(<DataTable caption="Videos" rows={[]} columns={columns} getRowId={(r) => r.id} empty="No video yet" />);
    expect(screen.getByText("No video yet")).toBeTruthy();
    rerender(<DataTable caption="Videos" rows={rows} columns={columns} getRowId={(r) => r.id} error="Could not load" />);
    expect(screen.getByRole("alert").textContent).toBe("Could not load");
  });

  it("turns into cards on a phone: the layout is carried by the classes, the semantics stay", () => {
    render(<DataTable caption="Videos" rows={rows} columns={columns} getRowId={(r) => r.id} layout="cards" />);
    expect(screen.getByRole("table").className).toContain("block");
    expect(screen.getAllByRole("cell")[0]?.getAttribute("data-card")).toBe("title");
  });
});

describe("DataTable v2 — filters", () => {
  it("filters by text, facet and range from the toolbar, shows the chips and announces the count", async () => {
    const user = userEvent.setup();
    const onFiltersChange = vi.fn();
    render(
      <DataTable caption="Videos" rows={rows} columns={columns} getRowId={(r) => r.id} onFiltersChange={onFiltersChange} toolbar={<DataTableFilters debounce={0} />} />,
    );
    expect(screen.getByRole("group", { name: "Filter the table" })).toBeTruthy();
    expect(screen.getByText("3 rows")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "Status" }));
    await user.click(await screen.findByRole("menuitemcheckbox", { name: "Live" }));
    await user.keyboard("{Escape}");
    expect(onFiltersChange).toHaveBeenLastCalledWith({ status: ["live"] });
    expect(names()).toEqual(["Beta", "Gamma"]);
    expect(screen.getByText("2 rows")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Remove Status: Live" })).toBeTruthy();

    await user.type(screen.getByRole("spinbutton", { name: "Views from" }), "10");
    expect(names()).toEqual(["Beta"]);

    await user.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(names()).toHaveLength(3);

    await user.type(screen.getByRole("searchbox", { name: "Search name" }), "gam");
    await act(async () => new Promise((resolve) => setTimeout(resolve, 10)));
    expect(names()).toEqual(["Gamma"]);
  });

  it("offers the values found in the rows, with their counts, when a facet has no options", async () => {
    const user = userEvent.setup();
    const facet: DataTableColumn<Row>[] = [{ id: "name", header: "Name" }, { id: "status", header: "Status", filter: "facet" }];
    render(<DataTable caption="Videos" rows={rows} columns={facet} getRowId={(r) => r.id} toolbar={<DataTableFilters />} />);
    await user.click(screen.getByRole("button", { name: "Status" }));
    const live = await screen.findByRole("menuitemcheckbox", { name: /live/ });
    expect(live.textContent).toBe("live2");
  });
});

describe("DataTable v2 — groups, details, trees", () => {
  it("groups rows by a column: a group row with its count and its aggregates, opened with its button", async () => {
    const user = userEvent.setup();
    render(<DataTable caption="Videos" rows={rows} columns={columns} getRowId={(r) => r.id} defaultGroupBy={["status"]} />);
    const group = screen.getByRole("button", { name: "live, 2 rows" });
    expect(group.getAttribute("aria-expanded")).toBe("false");
    expect(bodyRows()).toHaveLength(2);
    expect(within(bodyRows()[0]!).getAllByRole("cell").at(-1)?.textContent).toBe("35");
    await user.click(group);
    expect(group.getAttribute("aria-expanded")).toBe("true");
    expect(bodyRows()).toHaveLength(4);
  });

  it("opens a detail panel under a row", async () => {
    const user = userEvent.setup();
    const onExpandedChange = vi.fn();
    render(
      <DataTable caption="Videos" rows={rows} columns={columns} getRowId={(r) => r.id} rowLabel={(r) => r.name} renderDetail={(r) => <p>Tips: {r.tips ?? 0}</p>} onExpandedChange={onExpandedChange} />,
    );
    expect(screen.getByRole("columnheader", { name: "Details" })).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Show details of Alpha" }));
    expect(screen.getByText("Tips: 10")).toBeTruthy();
    expect(onExpandedChange).toHaveBeenLastCalledWith({ b: true });
  });

  it("shows the children of a row in a tree, indented", async () => {
    const user = userEvent.setup();
    type Node = { id: string; name: string; children?: Node[] };
    const tree: Node[] = [{ id: "root", name: "Studio", children: [{ id: "c1", name: "Clips" }] }];
    render(<DataTable caption="Folders" rows={tree} columns={[{ id: "name", header: "Name" }]} getRowId={(r) => r.id} getSubRows={(r) => r.children} rowLabel={(r) => r.name} />);
    expect(bodyRows()).toHaveLength(1);
    await user.click(screen.getByRole("button", { name: "Show details of Studio" }));
    expect(bodyRows()).toHaveLength(2);
    expect(within(bodyRows()[1]!).getAllByRole("cell")[1]?.style.paddingInlineStart).toBe("2.25rem");
  });
});

describe("DataTable v2 — columns", () => {
  it("hides and shows columns from the columns menu", async () => {
    const user = userEvent.setup();
    const onColumnVisibilityChange = vi.fn();
    render(<DataTable caption="Videos" rows={rows} columns={columns} getRowId={(r) => r.id} onColumnVisibilityChange={onColumnVisibilityChange} toolbar={<DataTableColumnsMenu />} />);
    await user.click(screen.getByRole("button", { name: "Columns" }));
    await user.click(await screen.findByRole("menuitemcheckbox", { name: "Views" }));
    expect(onColumnVisibilityChange).toHaveBeenLastCalledWith({ views: false });
    expect(screen.queryByRole("columnheader", { name: /Views/ })).toBeNull();
  });

  it("pins columns at the start and the end, and resizes a column from the keyboard", async () => {
    const user = userEvent.setup();
    render(<DataTable caption="Videos" rows={rows} columns={columns} getRowId={(r) => r.id} pinning={{ start: ["name"], end: ["views"] }} resizing layout="table" />);
    const headers = screen.getAllByRole("columnheader");
    expect(headers.map((h) => h.getAttribute("data-pin"))).toEqual(["start", null, "end"]);
    expect(headers[0]?.style.getPropertyValue("--dt-pin")).toBe("0px");
    expect(screen.getByRole("table").className).toContain("table-fixed");
    const handle = screen.getByRole("separator", { name: "Resize Status" });
    expect(handle.getAttribute("aria-valuenow")).toBe("150");
    handle.focus();
    await user.keyboard("{ArrowRight}");
    expect(handle.getAttribute("aria-valuenow")).toBe("166");
    await user.keyboard("{Shift>}{ArrowLeft}{/Shift}");
    expect(handle.getAttribute("aria-valuenow")).toBe("118");
  });
});

describe("DataTable v2 — pages and the server", () => {
  const many: Row[] = Array.from({ length: 45 }, (_, i) => ({ id: `r${i}`, name: `Video ${i + 1}`, views: i, status: i % 2 ? "live" : "draft" }));

  it("paginates in the browser with the pagination under the table", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<DataTable caption="Videos" rows={many} columns={columns} getRowId={(r) => r.id} defaultPageSize={20} onPageChange={onPageChange} />);
    expect(bodyRows()).toHaveLength(20);
    await user.click(screen.getByRole("button", { name: "Page 3" }));
    expect(onPageChange).toHaveBeenLastCalledWith(3);
    expect(bodyRows()).toHaveLength(5);
    expect(names()[0]).toBe("Video 41");
  });

  it("leaves sorting, filtering and pages to the server: the rows as given, the query announced", async () => {
    const user = userEvent.setup();
    const queries: DataTableQuery[] = [];
    render(
      <DataTable
        caption="Videos"
        rows={rows}
        columns={columns}
        getRowId={(r) => r.id}
        manual={{ sorting: true, filtering: true, pagination: true }}
        rowCount={120}
        defaultPageSize={3}
        onStateChange={(q) => queries.push(q)}
        toolbar={<DataTableFilters debounce={0} />}
      />,
    );
    expect(screen.getByText("120 rows")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Page 2" }));
    expect(queries.at(-1)).toEqual({ sort: null, filters: {}, page: 2, pageSize: 3 });
    await user.click(screen.getByRole("button", { name: /Name/ }));
    expect(queries.at(-1)).toEqual({ sort: { column: "name", direction: "ascending" }, filters: {}, page: 1, pageSize: 3 });
    expect(names()).toEqual(["Beta", "Alpha", "Gamma"]);
    await user.click(screen.getByRole("button", { name: "Status" }));
    await user.click(await screen.findByRole("menuitemcheckbox", { name: "Draft" }));
    expect(queries.at(-1)?.filters).toEqual({ status: ["draft"] });
    expect(names()).toHaveLength(3);
  });
});

describe("DataTable v2 — windowing, export, escape hatch", () => {
  it("renders only the rows in view when virtualized, and tells where they are", () => {
    const many = Array.from({ length: 2000 }, (_, i) => ({ id: `r${i}`, name: `Row ${i}`, views: i, status: "live" as const }));
    render(<DataTable caption="Events" rows={many} columns={columns} getRowId={(r) => r.id} virtualized={{ height: 400, estimateRowHeight: 40 }} />);
    expect(screen.getByRole("table").getAttribute("aria-rowcount")).toBe("2001");
    const rendered = bodyRows();
    expect(rendered.length).toBeLessThan(40);
    expect(rendered[0]?.getAttribute("aria-rowindex")).toBe("2");
    expect(screen.getByRole("region", { name: "Events" }).tabIndex).toBe(0);
  });

  it("exports the filtered and sorted rows of every page as CSV, escaping what must be", async () => {
    const user = userEvent.setup();
    const onExport = vi.fn();
    render(
      <DataTable caption="Videos" rows={rows} columns={columns} getRowId={(r) => r.id} defaultSort={{ column: "views", direction: "descending" }} defaultFilters={{ status: ["live"] }} defaultPageSize={1} toolbar={<DataTableExport onExport={onExport} />} />,
    );
    await user.click(screen.getByRole("button", { name: "Export CSV" }));
    expect(onExport).toHaveBeenCalledWith("Name,Status,Views\r\nBeta,live,30\r\nGamma,live,5");
    expect(dataTableCsv([{ a: 'say "hi", then', b: "=SUM(A1)", c: new Date("2026-10-12T00:00:00Z") }], [{ id: "a", header: "A" }, { id: "b", header: "B" }, { id: "c", header: "C" }])).toBe(
      'A,B,C\r\n"say ""hi"", then",\'=SUM(A1),2026-10-12T00:00:00.000Z',
    );
  });

  it("exposes the TanStack instance to what sits in the table", () => {
    function Count() {
      const { table } = useDataTable<Row>();
      return <p>{table.getCoreRowModel().rows.length} in the model</p>;
    }
    render(<DataTable caption="Videos" rows={rows} columns={columns} getRowId={(r) => r.id} toolbar={<Count />} />);
    expect(screen.getByText("3 in the model")).toBeTruthy();
    expect(() => render(<Count />)).toThrow(/inside a DataTable/);
  });
});

describe("DataTable — typed columns and priorities (#222)", () => {
  type Model = { id: string; name: string; maker: string; context: number; licence: string };
  const models: Model[] = [
    { id: "meta/llama", name: "Llama 3.3", maker: "Meta", context: 131072, licence: "Llama licence" },
    { id: "mistral/small", name: "Mistral Small", maker: "Mistral AI", context: 32768, licence: "Apache-2.0" },
  ];
  const typed: DataTableColumn<Model>[] = [
    { id: "name", header: "Model", type: "title", subtitle: (m) => m.id },
    { id: "maker", header: "Maker", type: "text", priority: 3 },
    { id: "licence", header: "Licence", type: "link", href: () => "https://example.test/licence", priority: 4 },
    { id: "context", header: "Context", type: "number", unit: "tokens", priority: 2 },
  ];
  const view = (props: Partial<React.ComponentProps<typeof DataTable<Model>>> = {}) =>
    render(<DataTable caption="Models" rows={models} columns={typed} getRowId={(m) => m.id} rowLabel={(m) => m.name} {...props} />);

  it("renders a title with its mono id, a number with a muted unit, a link, and aligns numbers to the end", () => {
    view();
    const row = screen.getAllByRole("row")[1] as HTMLElement;
    const [title, , , number] = within(row).getAllByRole("cell");
    expect(title?.getAttribute("data-card")).toBe("title");
    expect(within(title as HTMLElement).getByText("meta/llama").className).toContain("font-mono");
    expect(number?.className).toContain("text-right");
    expect(number?.className).toContain("tabular-nums");
    expect(number?.textContent).toBe("131,072tokens");
    expect(within(row).getByRole("link", { name: "Llama licence" }).getAttribute("href")).toBe("https://example.test/licence");
  });

  it("marks the columns that leave the row by their priority, on the cell and on the header", () => {
    view();
    const header = screen.getByRole("columnheader", { name: "Maker" });
    expect(header.className).toContain("@max-3xl:hidden!");
    expect(screen.getAllByRole("row")[1]?.querySelectorAll("td")[1]?.className).toContain("@max-3xl:hidden!");
    expect(screen.getByRole("columnheader", { name: "Model" }).className).not.toContain("hidden!");
  });

  it("opens what left the row from a chevron in the first cell, named after the row, and lists those columns only", async () => {
    const user = userEvent.setup();
    view();
    const toggle = screen.getByRole("button", { name: "Show more about Llama 3.3" });
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    await user.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    const detail = document.querySelector("dl") as HTMLElement;
    expect(within(detail).getAllByRole("term").map((t) => t.textContent)).toEqual(["Maker", "Licence", "Context"]);
    expect(within(detail).getByText("Meta")).toBeTruthy();
  });

  it("has no chevron when every column is in the row, and keeps the legacy `renderDetail` button", async () => {
    const user = userEvent.setup();
    const { unmount } = view({ columns: typed.map((c) => ({ ...c, priority: 1 as const })) });
    expect(screen.queryByRole("button", { name: /Show more/ })).toBeNull();
    unmount();
    view({ renderDetail: (m) => <p>Notes on {m.name}</p> });
    await user.click(screen.getByRole("button", { name: "Show details of Llama 3.3" }));
    expect(screen.getByText("Notes on Llama 3.3")).toBeTruthy();
    expect(document.querySelectorAll("dl")).toHaveLength(1);
  });

  it("never scrolls sideways in cards, even with untyped columns, and lets the values wrap", () => {
    const { container } = render(<DataTable caption="Videos" rows={rows} columns={columns} getRowId={(r) => r.id} layout="cards" />);
    expect(container.querySelector("table")?.parentElement?.className).toContain("overflow-x-clip!");
    expect(container.querySelector("td")?.className).toContain("[overflow-wrap:anywhere]");
  });

  it("never scrolls sideways by default once columns are typed, and scrolls with fades only when asked", () => {
    const { container, unmount } = view();
    expect(container.querySelector("table")?.parentElement?.className).toContain("overflow-x-clip");
    unmount();
    const scrolling = view({ scroll: true });
    expect(scrolling.container.querySelector("table")?.parentElement?.className).toContain("overflow-x-auto");
    expect(scrolling.container.querySelector("table")?.parentElement?.className).toContain("no-repeat");
    scrolling.unmount();
    // untyped columns keep the old scroller, so existing tables do not change
    const legacy = render(<DataTable caption="Videos" rows={rows} columns={columns} getRowId={(r) => r.id} />);
    expect(legacy.container.querySelector("table")?.parentElement?.className).toContain("overflow-x-auto");
  });

  it("makes the header sticky, zebra rows and one row height per density on request", () => {
    const { container } = view({ stickyHeader: 64, striped: true, density: "compact" });
    const th = screen.getByRole("columnheader", { name: "Model" });
    expect(th.className).toContain("@xl:sticky");
    expect(th.style.getPropertyValue("--dt-top")).toBe("64px");
    const tr = container.querySelector("tbody tr") as HTMLElement;
    expect(tr.className).toContain("even:bg-surface-2/40");
    expect(tr.querySelector("td")?.className).toContain("@xl:h-12");
  });

  it("clamps text to the lines asked and truncates one-line values, the full value on hover", () => {
    view({ columns: [{ id: "maker", header: "Maker", type: "text", clamp: 1 }, { id: "licence", header: "Licence", nowrap: true }] });
    const cells = screen.getAllByRole("row")[1]?.querySelectorAll("td") as NodeListOf<HTMLElement>;
    expect(cells[0]?.querySelector("span")?.className).toContain("line-clamp-1");
    expect(cells[0]?.querySelector("span")?.getAttribute("title")).toBe("Meta");
    expect(cells[1]?.querySelector("span")?.className).toContain("truncate");
  });

  it("stays accessible: a real table, the detail button named and expanded, no axe violation", async () => {
    const { container } = view();
    expect(screen.getByRole("table", { name: "Models" })).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });
});
