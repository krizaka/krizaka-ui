import { fireEvent, render, screen, within } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { vi } from "vitest";

import { axeViolations } from "../test/axe";
import { Agenda } from "./index";

const items = [
  { id: "b", start: "2026-10-22T11:00:00Z", end: "2026-10-22T11:45:00Z", title: "Sofia", description: "Cut" },
  { id: "a", start: "2026-10-22T09:00:00Z", end: "2026-10-22T09:45:00Z", title: "Léa", description: "Colour" },
];
const base = { "aria-label": "Appointments", timeZone: "UTC", locale: "en-US", items };

describe("Agenda", () => {
  it("orders by time and places the now line between the past and the to come, with no axe violation", async () => {
    const { container } = render(<Agenda {...base} now={new Date("2026-10-22T10:00:00Z")} />);
    const rows = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(rows.map((r) => r.textContent)).toEqual([expect.stringContaining("Léa"), expect.stringContaining("Now · 10:00"), expect.stringContaining("Sofia")]);
    expect(await axeViolations(container)).toEqual([]);
  });

  it("puts the line last when every item has begun, and draws none without now", () => {
    const { rerender } = render(<Agenda {...base} now={new Date("2026-10-22T18:00:00Z")} />);
    expect(screen.getAllByRole("listitem").at(-1)?.textContent).toContain("Now");
    rerender(<Agenda {...base} now={null} />);
    expect(screen.queryByText(/Now/)).toBeNull();
  });

  it("marks the current item, selects by button, and keeps the action outside the row", () => {
    const onSelect = vi.fn();
    render(<Agenda {...base} now={new Date("2026-10-22T09:10:00Z")} selectedId="a" onSelect={onSelect} action={(i) => <button>{`Start ${i.id}`}</button>} />);
    const row = screen.getByRole("button", { name: /Léa/ });
    expect(row.getAttribute("data-current")).toBe("true");
    expect(row.getAttribute("aria-current")).toBe("true");
    expect(row.querySelector("button")).toBeNull();
    fireEvent.click(row);
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: "a" }));
    expect(screen.getByRole("button", { name: "Start b" })).toBeTruthy();
  });

  it("renders links with an href, shows the empty slot, and renders on the server", () => {
    const { rerender } = render(<Agenda {...base} items={items.map((i) => ({ ...i, href: `?appointment=${i.id}` }))} />);
    expect(screen.getByRole("link", { name: /Léa/ }).getAttribute("href")).toBe("?appointment=a");
    rerender(<Agenda {...base} items={[]} empty={<p>Nothing today</p>} />);
    expect(screen.getByText("Nothing today")).toBeTruthy();
    expect(renderToStaticMarkup(<Agenda {...base} />)).toContain("9:00");
  });
});
