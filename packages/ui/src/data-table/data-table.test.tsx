import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { axeViolations } from "../test/axe";
import { DataTable, type DataTableColumn } from "./index";

type Row = { id: string; name: string; views: number };
const rows: Row[] = [
  { id: "a", name: "Beta", views: 30 },
  { id: "b", name: "Alpha", views: 120 },
  { id: "c", name: "Gamma", views: 5 },
];
const columns: DataTableColumn<Row>[] = [
  { id: "name", header: "Name", sortable: true, card: "title" },
  { id: "views", header: "Views", sortable: true, align: "end" },
];
const names = () => screen.getAllByRole("row").slice(1).map((row) => within(row).getAllByRole("cell").at(-2)?.textContent);

describe("DataTable", () => {
  it("is a captioned table with column headers, with no axe violation", async () => {
    const { container } = render(<DataTable caption="Videos" rows={rows} columns={columns} getRowId={(r) => r.id} selectable rowLabel={(r) => r.name} />);
    expect(screen.getByRole("table", { name: "Videos" })).toBeTruthy();
    expect(screen.getAllByRole("columnheader")).toHaveLength(3);
    expect(screen.getAllByRole("cell")[1]?.getAttribute("data-label")).toBe("Name");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("sorts ascending, descending, then back, and says so with aria-sort", async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    render(<DataTable caption="Videos" rows={rows} columns={columns} getRowId={(r) => r.id} onSortChange={onSortChange} />);
    const header = screen.getByRole("columnheader", { name: /Views/ });
    expect(header.getAttribute("aria-sort")).toBe("none");
    await user.click(within(header).getByRole("button"));
    expect(header.getAttribute("aria-sort")).toBe("ascending");
    expect(screen.getAllByRole("row").slice(1).map((r) => r.textContent)).toEqual(["Gamma5", "Beta30", "Alpha120"]);
    await user.click(within(header).getByRole("button"));
    expect(header.getAttribute("aria-sort")).toBe("descending");
    await user.click(within(header).getByRole("button"));
    expect(onSortChange).toHaveBeenLastCalledWith(null);
  });

  it("leaves the order to the server with manualSort", async () => {
    const user = userEvent.setup();
    render(<DataTable caption="Videos" rows={rows} columns={columns} getRowId={(r) => r.id} manualSort />);
    await user.click(screen.getByRole("button", { name: /Name/ }));
    expect(screen.getAllByRole("row")[1]?.textContent).toBe("Beta30");
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
    expect(names()).toHaveLength(3);
  });

  it("shows loading, empty and error states", () => {
    const { rerender } = render(<DataTable caption="Videos" rows={[]} columns={columns} getRowId={(r) => r.id} loading />);
    expect(screen.getByRole("table").getAttribute("aria-busy")).toBe("true");
    rerender(<DataTable caption="Videos" rows={[]} columns={columns} getRowId={(r) => r.id} empty="No video yet" />);
    expect(screen.getByText("No video yet")).toBeTruthy();
    rerender(<DataTable caption="Videos" rows={rows} columns={columns} getRowId={(r) => r.id} error="Could not load" />);
    expect(screen.getByRole("alert").textContent).toBe("Could not load");
  });

  it("renders only the rows in view when windowed, and tells where they are", () => {
    const many = Array.from({ length: 2000 }, (_, i) => ({ id: `r${i}`, name: `Row ${i}`, views: i }));
    render(<DataTable caption="Events" rows={many} columns={columns} getRowId={(r) => r.id} virtualize={{ rowHeight: 40, height: 400 }} />);
    expect(screen.getByRole("table").getAttribute("aria-rowcount")).toBe("2001");
    const rendered = screen.getAllByRole("row").slice(1);
    expect(rendered.length).toBeLessThan(40);
    expect(rendered[0]?.getAttribute("aria-rowindex")).toBe("2");
    expect(screen.getByRole("region", { name: "Events" }).tabIndex).toBe(0);
  });

  it("turns into cards on a phone: the layout is carried by the classes, the semantics stay", () => {
    render(<DataTable caption="Videos" rows={rows} columns={columns} getRowId={(r) => r.id} layout="cards" />);
    expect(screen.getByRole("table").className).toContain("block");
    expect(screen.getAllByRole("cell")[0]?.getAttribute("data-card")).toBe("title");
  });
});

describe("DataTable — sticky header", () => {
  it("scrolls its body past maxHeight in a region the keyboard reaches, the header on top", async () => {
    const { container } = render(<DataTable caption="Runs" rows={rows} columns={columns} getRowId={(r) => r.id} layout="table" maxHeight={120} />);
    const region = screen.getByRole("region", { name: "Runs" });
    expect(region.getAttribute("tabindex")).toBe("0");
    expect(region.style.maxHeight).toBe("120px");
    expect(screen.getAllByRole("columnheader")[0].className).toContain("sticky");
    expect(await axeViolations(container)).toEqual([]);
  });
});
