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

describe("SlotPicker weeks", () => {
  const buttons = { previous: "Previous week", today: "Today", next: "Next week" };
  const weekProps = { ...props, weekButtons: buttons, weekLabel: "Oct 19 – 25", todayWeek: "2026-10-19", minWeek: "2026-10-19", maxWeek: "2026-11-02" };

  it("round-trips the weeks: ← and → ask for ±7 days, Today goes back, the label is announced", () => {
    const onWeekChange = vi.fn();
    const { rerender } = render(<SlotPicker {...weekProps} days={days} week="2026-10-26" onWeekChange={onWeekChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Next week" }));
    expect(onWeekChange).toHaveBeenLastCalledWith("2026-11-02");
    fireEvent.click(screen.getByRole("button", { name: "Previous week" }));
    expect(onWeekChange).toHaveBeenLastCalledWith("2026-10-19");
    fireEvent.click(screen.getByRole("button", { name: "Today" }));
    expect(onWeekChange).toHaveBeenLastCalledWith("2026-10-19");
    expect(screen.getByRole("status").textContent).toBe("Oct 19 – 25");
    rerender(<SlotPicker {...weekProps} weekLabel="Oct 26 – Nov 1" days={days} week="2026-10-26" onWeekChange={onWeekChange} />);
    expect(screen.getByRole("status").textContent).toBe("Oct 26 – Nov 1");
  });

  it("disables the ends: no earlier than minWeek, no later than maxWeek, Today on the current week", () => {
    const onWeekChange = vi.fn();
    const { rerender } = render(<SlotPicker {...weekProps} days={days} week="2026-10-19" onWeekChange={onWeekChange} />);
    for (const name of ["Previous week", "Today"]) expect(screen.getByRole("button", { name }).getAttribute("aria-disabled")).toBe("true");
    fireEvent.click(screen.getByRole("button", { name: "Previous week" }));
    expect(onWeekChange).not.toHaveBeenCalled();
    rerender(<SlotPicker {...weekProps} days={days} week="2026-11-02" onWeekChange={onWeekChange} />);
    expect(screen.getByRole("button", { name: "Next week" }).getAttribute("aria-disabled")).toBe("true");
    fireEvent.click(screen.getByRole("button", { name: "Next week" }));
    expect(onWeekChange).not.toHaveBeenCalled();
  });

  it("changes week with Page Up / Page Down from a time and keeps focus in the picker", () => {
    const onWeekChange = vi.fn();
    const { rerender } = render(<SlotPicker {...weekProps} days={days} week="2026-10-26" onWeekChange={onWeekChange} />);
    const time = screen.getByRole("button", { name: "9:00 AM" });
    time.focus();
    fireEvent.keyDown(time, { key: "PageDown" });
    expect(onWeekChange).toHaveBeenLastCalledWith("2026-11-02");
    rerender(<SlotPicker {...weekProps} days={days} week="2026-11-02" onWeekChange={onWeekChange} />);
    expect(document.activeElement?.getAttribute("aria-pressed")).toBe("true");
    expect(document.activeElement?.textContent).toContain("Today");
    fireEvent.keyDown(document.activeElement as Element, { key: "PageUp" });
    expect(onWeekChange).toHaveBeenLastCalledWith("2026-10-26");
  });

  it("makes the week buttons links when the address holds the week (?week=)", () => {
    render(<SlotPicker {...weekProps} days={days} week="2026-10-26" weekHref={(w) => `/book?week=${w}`} />);
    expect(screen.getByRole("link", { name: "Next week" }).getAttribute("href")).toBe("/book?week=2026-11-02");
    expect(screen.getByRole("link", { name: "Previous week" }).getAttribute("href")).toBe("/book?week=2026-10-19");
  });

  it("moves with the arrows inside a day and between days, skipping the full slots", () => {
    const day = { id: "d", label: "Today", slots: [{ id: "a", label: "9:00 AM" }, { id: "b", label: "9:30 AM", note: "Full", disabled: true }, { id: "c", label: "10:00 AM" }] };
    render(<SlotPicker {...props} days={[day, ...days]} />);
    const a = screen.getByRole("button", { name: "9:00 AM" });
    a.focus();
    fireEvent.keyDown(a, { key: "ArrowRight" });
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "10:00 AM" }));
    const first = screen.getByRole("button", { name: "Today Oct 19" });
    first.focus();
    fireEvent.keyDown(first, { key: "ArrowRight" });
    expect(document.activeElement?.textContent).toContain("Tue");
  });

  it("announces a full slot with its reason, struck out and disabled — not by colour alone", () => {
    render(<SlotPicker {...props} days={[{ id: "d", label: "Today", slots: [{ id: "x", label: "9:00 AM", note: "Full", disabled: true }] }]} />);
    const full = screen.getByRole("button", { name: "9:00 AM Full" }) as HTMLButtonElement;
    expect(full.disabled).toBe(true);
    expect(full.className).toContain("line-through");
  });

  it("groups a day's times under Morning / Afternoon and shows the footer", async () => {
    const grouped = [{ id: "d", label: "Today", groups: [{ id: "am", label: "Morning", slots: [{ id: "a", label: "9:00 AM" }] }, { id: "pm", label: "Afternoon", slots: [{ id: "b", label: "2:00 PM" }] }] }];
    const { container } = render(<SlotPicker {...weekProps} days={grouped} week="2026-10-19" footer="Montréal (UTC−4) · 45 min" />);
    expect(screen.getByText("Morning")).toBeTruthy();
    expect(screen.getByRole("list", { name: "Today · Afternoon" })).toBeTruthy();
    expect(screen.getByText("Montréal (UTC−4) · 45 min")).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("keeps the week bar and says plainly when the week has no time", () => {
    render(<SlotPicker {...weekProps} days={[]} week="2026-10-26" />);
    expect(screen.getByRole("button", { name: "Next week" })).toBeTruthy();
    expect(screen.getByText("Nothing free")).toBeTruthy();
  });

  it("holds at 360 px: the week bar wraps and no time is wider than the picker", () => {
    const { container } = render(<SlotPicker {...weekProps} days={days} week="2026-10-26" style={{ width: 360 }} />);
    expect(container.firstElementChild?.className).toContain("min-w-0");
    expect(container.querySelector(".flex-wrap")).toBeTruthy();
  });
});
