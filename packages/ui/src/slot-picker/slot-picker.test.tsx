import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { axeViolations } from "../test/axe";
import { SlotPicker } from "./index";

const days = [
  { id: "d1", label: "Today", sub: "Oct 19", slots: [{ id: "d1-9", label: "9:00 AM" }, { id: "d1-10", label: "10:00 AM", note: "2 spots" }] },
  { id: "d2", label: "Tue", sub: "Oct 20", slots: [{ id: "d2-8", label: "8:00 AM" }] },
];
const props = { label: "Available times", emptyLabel: "Nothing free" };

describe("SlotPicker", () => {
  it("shows the first day's times and switches day, with no axe violation", async () => {
    const { container } = render(<SlotPicker {...props} days={days} />);
    expect(screen.getByRole("button", { name: "9:00 AM" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "8:00 AM" })).toBeNull();
    expect(screen.getByText("2 spots")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /Tue/ }));
    expect(screen.getByRole("button", { name: "8:00 AM" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "9:00 AM" })).toBeNull();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("chooses a time: reports its id and marks the chosen one", () => {
    const onValueChange = vi.fn();
    const { rerender } = render(<SlotPicker {...props} days={days} value={null} onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole("button", { name: "9:00 AM" }));
    expect(onValueChange).toHaveBeenCalledWith("d1-9");
    rerender(<SlotPicker {...props} days={days} value="d1-9" onValueChange={onValueChange} />);
    expect(screen.getByRole("button", { name: "9:00 AM" }).getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByRole("button", { name: /10:00 AM/ }).getAttribute("aria-pressed")).toBe("false");
  });

  it("makes each time a link when it has an address", () => {
    const linked = days.map((d) => ({ ...d, slots: d.slots.map((s) => ({ ...s, href: `/book?start=${s.id}` })) }));
    render(<SlotPicker {...props} days={linked} />);
    expect(screen.getByRole("link", { name: "9:00 AM" }).getAttribute("href")).toBe("/book?start=d1-9");
  });

  it("can start on another day", () => {
    render(<SlotPicker {...props} days={days} defaultDay="d2" />);
    expect(screen.getByRole("button", { name: "8:00 AM" })).toBeTruthy();
  });

  it("says plainly when no time is free", () => {
    render(<SlotPicker {...props} days={[]} />);
    expect(screen.getByText("Nothing free")).toBeTruthy();
  });

  it("shows a disabled time as disabled", () => {
    render(<SlotPicker {...props} days={[{ id: "d", label: "Today", slots: [{ id: "x", label: "9:00 AM", disabled: true }] }]} />);
    expect((screen.getByRole("button", { name: "9:00 AM" }) as HTMLButtonElement).disabled).toBe(true);
  });
});
