import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { axeViolations } from "../test/axe";
import { FilterBar, FilterMenu, readFilterParams, writeFilterParams } from "./index";

describe("FilterBar", () => {
  it("is a named group with the active filters as removable chips, with no axe violation", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    const onClearAll = vi.fn();
    const { container } = render(
      <FilterBar label="Filter jobs" active={[{ id: "s", label: "Status: Failed", onRemove }]} onClearAll={onClearAll} results="6 jobs">
        <button type="button">Status</button>
      </FilterBar>,
    );
    expect(screen.getByRole("group", { name: "Filter jobs" })).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Remove Status: Failed" }));
    expect(onRemove).toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(onClearAll).toHaveBeenCalled();
    expect(screen.getByText("6 jobs").getAttribute("aria-live")).toBe("polite");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("FilterMenu checks several values from the keyboard, the menu staying open", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<FilterMenu label="Status" options={[{ value: "done", label: "Done" }, { value: "failed", label: "Failed", count: 3 }]} value={["done"]} onValueChange={onValueChange} />);
    const trigger = screen.getByRole("button", { name: /Status/ });
    expect(trigger.textContent).toContain("1");
    trigger.focus();
    await user.keyboard("{Enter}");
    const failed = await screen.findByRole("menuitemcheckbox", { name: /Failed/ });
    expect(screen.getByRole("menuitemcheckbox", { name: "Done" }).getAttribute("aria-checked")).toBe("true");
    failed.focus();
    await user.keyboard(" ");
    expect(onValueChange).toHaveBeenLastCalledWith(["done", "failed"]);
    expect(screen.getByRole("menu")).toBeTruthy();
  });

  it("FilterMenu with one value uses radios and shows the choice on its button", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<FilterMenu label="Model" multiple={false} options={[{ value: "a", label: "Flux" }, { value: "b", label: "Whisper" }]} value="a" onValueChange={onValueChange} />);
    const trigger = screen.getByRole("button", { name: "Model: Flux" });
    await user.click(trigger);
    await user.click(await screen.findByRole("menuitemradio", { name: "Whisper" }));
    expect(onValueChange).toHaveBeenCalledWith("b");
  });

  it("reads and writes the filters of an address, resetting the page", () => {
    const params = new URLSearchParams("status=done,failed&status=running&page=3&q=cat");
    expect(readFilterParams(params, ["status", "role"])).toEqual({ status: ["done", "failed", "running"], role: [] });
    const next = writeFilterParams(params, { status: ["failed"], q: "" });
    expect(next.toString()).toBe("status=failed");
  });
});
