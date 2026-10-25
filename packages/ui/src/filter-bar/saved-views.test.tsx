import { parseView, sameFilters, viewSearch } from "@krizaka/organize/contract";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";

import { axeViolations } from "../test/axe";
import { FilterBar, type SavedViewItem, SavedViews } from "./index";

const VIEWS: SavedViewItem[] = [
  { id: "mine-1", label: "Winter storage", group: "mine", count: 5 },
  { id: "all", label: "All clients", group: "system", count: 42 },
  { id: "shared-1", label: "Pick-ups", group: "workspace", count: 3 },
  { id: "to_follow", label: "To follow up", group: "system", count: 7 },
];

describe("SavedViews (#627)", () => {
  it("orders the groups system · workspace · mine, names each, and shows the counts", async () => {
    const { container } = render(<SavedViews views={VIEWS} current="all" onSelect={() => {}} />);
    const bar = screen.getAllByRole("group", { name: "Views" })[0]!;
    const groups = within(bar).getAllByRole("radiogroup").map((g) => g.getAttribute("aria-label"));
    expect(groups).toEqual(["Standard views", "Shared views", "My views"]);
    expect(within(bar).getByRole("radio", { name: /All clients/ }).textContent).toContain("42");
    expect(within(bar).getByRole("radio", { name: /All clients/ }).getAttribute("aria-checked")).toBe("true");
    expect(within(bar).getByRole("radio", { name: /Winter storage/ }).getAttribute("aria-checked")).toBe("false");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("chooses a view from the keyboard", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<SavedViews views={VIEWS} current="all" onSelect={onSelect} />);
    const bar = screen.getAllByRole("group", { name: "Views" })[0]!;
    within(bar).getByRole("radio", { name: /To follow up/ }).focus();
    await user.keyboard(" ");
    expect(onSelect).toHaveBeenCalledWith("to_follow");
  });

  it("is made of links when the views have an address: the current one is aria-current", () => {
    const linked = VIEWS.map((v) => ({ ...v, href: `/clients?view=${v.id}` }));
    render(<SavedViews views={linked} current="to_follow" />);
    const current = screen.getAllByRole("link", { name: /To follow up/ })[0]!;
    expect(current.getAttribute("href")).toBe("/clients?view=to_follow");
    expect(current.getAttribute("aria-current")).toBe("page");
    expect(screen.getAllByRole("link", { name: /All clients/ })[0]!.getAttribute("aria-current")).toBeNull();
  });

  it("marks a modified view and saves it under a name: Enter keeps, Escape leaves, an empty name cannot", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<SavedViews views={VIEWS} current="to_follow" modified onSave={onSave} />);
    expect(screen.getAllByText("(modified)").length).toBeGreaterThan(0);
    await user.click(screen.getByRole("button", { name: "Save view" }));
    const field = screen.getByRole("textbox", { name: "Name of the view" });
    expect(document.activeElement).toBe(field);
    expect((screen.getByRole("button", { name: "Save" }) as HTMLButtonElement).disabled).toBe(true);
    await user.type(field, "  Spring   service {Enter}");
    expect(onSave).toHaveBeenCalledWith("Spring service");
    expect(screen.queryByRole("textbox")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Save view" }));
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("textbox")).toBeNull();
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it("offers save only when modified, and rename and delete only for the views the person may change", async () => {
    const user = userEvent.setup();
    const onRename = vi.fn();
    const onDelete = vi.fn();
    const { rerender } = render(<SavedViews views={VIEWS} current="all" onSave={() => {}} onRename={onRename} onDelete={onDelete} />);
    expect(screen.queryByRole("button", { name: "Save view" })).toBeNull();
    expect(screen.queryByRole("button", { name: /Actions for the view/ })).toBeNull();
    rerender(<SavedViews views={VIEWS} current="mine-1" onRename={onRename} onDelete={onDelete} />);
    screen.getByRole("button", { name: "Actions for the view Winter storage" }).focus();
    await user.keyboard("{Enter}");
    await user.click(await screen.findByRole("menuitem", { name: "Rename" }));
    const field = screen.getByRole("textbox", { name: "Name of the view" }) as HTMLInputElement;
    expect(field.value).toBe("Winter storage");
    await user.clear(field);
    await user.type(field, "Storage 2026{Enter}");
    expect(onRename).toHaveBeenCalledWith("mine-1", "Storage 2026");
    screen.getByRole("button", { name: "Actions for the view Winter storage" }).focus();
    await user.keyboard("{Enter}");
    await user.click(await screen.findByRole("menuitem", { name: "Delete" }));
    expect(onDelete).toHaveBeenCalledWith("mine-1");
  });

  it("is ONE menu on a phone: « View: … », the groups, the counts", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<SavedViews views={VIEWS} current="to_follow" onSelect={onSelect} />);
    const trigger = screen.getByRole("button", { name: /View: To follow up/ });
    trigger.focus();
    await user.keyboard("{Enter}");
    const menu = await screen.findByRole("menu");
    expect(within(menu).getAllByRole("menuitemradio").map((i) => i.textContent)).toEqual(["All clients · 42", "To follow up · 7", "Pick-ups · 3", "Winter storage · 5"]);
    expect(within(menu).getByRole("menuitemradio", { name: /To follow up/ }).getAttribute("aria-checked")).toBe("true");
    await user.click(within(menu).getByRole("menuitemradio", { name: /Winter storage/ }));
    expect(onSelect).toHaveBeenCalledWith("mine-1");
  });

  it("says « All » when no view is in force", () => {
    render(<SavedViews views={VIEWS} current={null} />);
    expect(screen.getByRole("button", { name: "View: All" })).toBeTruthy();
  });

  it("sits in a FilterBar and round-trips through the address with the contract's helpers", () => {
    const filters = { status: ["to_decide"], tags: ["0b7e4c9a-1111-4222-8333-123456789abc"], q: "gravel" };
    const search = viewSearch(filters, "to_follow");
    const parsed = parseView(new URLSearchParams(search));
    expect(parsed.view).toBe("to_follow");
    expect(sameFilters(parsed.filters, filters)).toBe(true);
    expect(sameFilters(parsed.filters, { ...filters, q: "city" })).toBe(false);
    render(<FilterBar label="Filter clients" views={{ views: VIEWS, current: "all" }} />);
    expect(screen.getByRole("group", { name: "Filter clients" }).querySelector("[role=radiogroup]")).toBeTruthy();
  });
});
