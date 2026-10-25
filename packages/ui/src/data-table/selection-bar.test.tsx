import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";

import { axeViolations } from "../test/axe";
import { DataTable, type DataTableColumn, SelectionBar } from "./index";

describe("SelectionBar (#627)", () => {
  it("says the count politely, holds the product's actions and clears the selection", async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    const { container } = render(
      <SelectionBar count={3} onClear={onClear} result="2 moved, 1 skipped">
        <button type="button">Move status</button>
      </SelectionBar>,
    );
    const bar = screen.getByRole("toolbar", { name: "Actions on the selection" });
    expect(bar.querySelector("[aria-live=polite]")?.textContent).toBe("3 selected");
    expect(screen.getByText("2 moved, 1 skipped").getAttribute("aria-live")).toBe("polite");
    await user.click(screen.getByRole("button", { name: "Clear selection" }));
    expect(onClear).toHaveBeenCalled();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("is not shown at 0, and docks above the tab bar through --kz-dock-offset", () => {
    const { rerender } = render(<SelectionBar count={0} onClear={() => {}} />);
    expect(screen.getByRole("toolbar", { hidden: true }).hasAttribute("hidden")).toBe(true);
    rerender(<SelectionBar count={1} onClear={() => {}} />);
    const bar = screen.getByRole("toolbar");
    expect(bar.className).toContain("sticky");
    expect(bar.className).toContain("bottom-(--kz-dock-offset,0px)");
  });

  it("past the most the service takes, says so and rests the actions", () => {
    render(
      <SelectionBar count={201} max={200} onClear={() => {}}>
        <button type="button">Tag</button>
      </SelectionBar>,
    );
    expect(screen.getByText("At most 200 at a time")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Tag", hidden: true }).closest("[inert]")).toBeTruthy();
  });

  it("translates through labels", () => {
    render(<SelectionBar count={2} onClear={() => {}} labels={{ selected: (n) => `${n} sélectionnés`, clear: "Annuler la sélection" }} />);
    expect(screen.getByText("2 sélectionnés")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Annuler la sélection" })).toBeTruthy();
  });
});

type Row = { id: string; name: string };
const rows: Row[] = [{ id: "a", name: "Eric Tremblay" }, { id: "b", name: "Demo client" }];
const columns: DataTableColumn<Row>[] = [{ id: "name", header: "Client" }];

describe("DataTable bulkActions (#627)", () => {
  it("draws the bar while rows are chosen, hands the ids to the actions and clears", async () => {
    const user = userEvent.setup();
    const seen: string[][] = [];
    render(
      <DataTable
        caption="Clients" rows={rows} columns={columns} getRowId={(r) => r.id} rowLabel={(r) => r.name} selectable
        bulkActions={({ selected }) => <button type="button" onClick={() => seen.push(selected)}>Tag</button>}
      />,
    );
    expect(screen.getByRole("toolbar", { hidden: true }).hasAttribute("hidden")).toBe(true);
    await user.click(screen.getByRole("checkbox", { name: "Select Eric Tremblay" }));
    await user.click(screen.getByRole("checkbox", { name: "Select Demo client" }));
    expect(screen.getByText("2 selected")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Tag" }));
    expect(seen).toEqual([["a", "b"]]);
    await user.click(screen.getByRole("button", { name: "Clear selection" }));
    expect((screen.getByRole("checkbox", { name: "Select Eric Tremblay" }) as HTMLInputElement).getAttribute("aria-checked")).toBe("false");
    expect(screen.getByRole("toolbar", { hidden: true }).hasAttribute("hidden")).toBe(true);
  });
});
