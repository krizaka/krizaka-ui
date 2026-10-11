import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { axeViolations } from "../test/axe";
import { addMonths, Calendar, DatePicker, DateRangePicker, weekStartOf } from "./index";

describe("date helpers", () => {
  it("adds months without overflowing the shorter ones", () => {
    expect(addMonths("2026-01-31", 1)).toBe("2026-02-28");
    expect(addMonths("2026-12-15", 1)).toBe("2027-01-15");
  });
  it("knows when a locale's week starts", () => {
    expect([0, 1]).toContain(weekStartOf("en-US"));
    expect(weekStartOf("fr-FR")).toBe(1);
  });
});

describe("Calendar", () => {
  it("is a grid labelled by its month, today and the choice marked, with no axe violation", async () => {
    const { container } = render(<Calendar locale="en-US" value="2026-10-14" today="2026-10-11" weekStartsOn={0} />);
    expect(screen.getByRole("grid", { name: "October 2026" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "October 11, 2026" }).getAttribute("aria-current")).toBe("date");
    const chosen = screen.getByRole("button", { name: "October 14, 2026" });
    expect(chosen.closest("[role=gridcell]")?.getAttribute("aria-selected")).toBe("true");
    expect(chosen.tabIndex).toBe(0);
    expect(screen.getAllByRole("columnheader")[0]?.textContent).toBe("Sun");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("walks the days, the week and the months with the keyboard", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Calendar locale="en-US" value="2026-10-30" today="2026-10-11" weekStartsOn={0} onSelect={onSelect} />);
    screen.getByRole("button", { name: "October 30, 2026" }).focus();
    await user.keyboard("{ArrowRight}{ArrowRight}");
    expect(document.activeElement?.getAttribute("aria-label")).toBe("November 1, 2026");
    expect(screen.getByRole("grid", { name: "November 2026" })).toBeTruthy();
    await user.keyboard("{PageUp}");
    expect(document.activeElement?.getAttribute("aria-label")).toBe("October 1, 2026");
    await user.keyboard("{End}{Enter}");
    expect(onSelect).toHaveBeenLastCalledWith("2026-10-03");
  });

  it("disables what is out of bounds", () => {
    render(<Calendar locale="en-US" value="2026-10-14" today="2026-10-11" min="2026-10-11" isDateDisabled={(d) => d === "2026-10-20"} />);
    expect((screen.getByRole("button", { name: "October 10, 2026" }) as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByRole("button", { name: "October 20, 2026" }) as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByRole("button", { name: "Previous month" }) as HTMLButtonElement).disabled).toBe(true);
  });

  it("speaks French with the fr-CA locale", () => {
    render(<Calendar locale="fr-CA" value="2026-10-11" today="2026-10-11" labels={{ previousMonth: "Mois précédent", nextMonth: "Mois suivant" }} />);
    expect(screen.getByRole("grid", { name: "octobre 2026" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "11 octobre 2026" })).toBeTruthy();
  });
});

describe("DatePicker", () => {
  it("opens a calendar from a labelled button, writes the date in the locale and returns an ISO value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<DatePicker label="Publish on" locale="en-US" defaultValue="2026-10-14" today="2026-10-11" onValueChange={onValueChange} clearable name="publishAt" />);
    const trigger = screen.getByRole("button", { name: /Publish on/ });
    expect(trigger.textContent).toBe("Oct 14, 2026");
    expect(trigger.getAttribute("aria-haspopup")).toBe("dialog");
    await user.click(trigger);
    expect(await screen.findByRole("grid")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "October 16, 2026" }));
    expect(onValueChange).toHaveBeenLastCalledWith("2026-10-16");
    expect(screen.queryByRole("grid")).toBeNull();
    expect((document.querySelector("input[name=publishAt]") as HTMLInputElement).value).toBe("2026-10-16");
    await user.click(screen.getByRole("button", { name: "Clear date" }));
    expect(onValueChange).toHaveBeenLastCalledWith(null);
  });

  it("DateRangePicker takes two clicks, in either order, or a preset", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <DateRangePicker
        label="Period"
        locale="en-US"
        today="2026-10-11"
        defaultValue={{ start: "2026-10-01", end: "2026-10-05" }}
        onValueChange={onValueChange}
        presets={[{ label: "Last 7 days", start: "2026-10-05", end: "2026-10-11" }]}
      />,
    );
    await user.click(screen.getByRole("button", { name: /Period/ }));
    await user.click(await screen.findByRole("button", { name: "October 9, 2026" }));
    await user.click(screen.getByRole("button", { name: "October 3, 2026" }));
    expect(onValueChange).toHaveBeenLastCalledWith({ start: "2026-10-03", end: "2026-10-09" });
    await user.click(screen.getByRole("button", { name: /Period/ }));
    await user.click(await screen.findByRole("button", { name: "Last 7 days" }));
    expect(onValueChange).toHaveBeenLastCalledWith({ start: "2026-10-05", end: "2026-10-11" });
  });
});
