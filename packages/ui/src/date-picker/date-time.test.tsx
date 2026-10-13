import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { axeViolations } from "../test/axe";
import {
  ageOn,
  Calendar,
  DateField,
  DateRangePicker,
  DateWheel,
  daysInMonth,
  DayStrip,
  formatTime,
  isoOf,
  latestBirthDate,
  monthNames,
  MonthPicker,
  TimePicker,
  timeSlots,
  timeToMinutes,
  uses12Hours,
  Wheel,
  WheelPicker,
  yearRange,
} from "./index";

describe("date and time helpers", () => {
  it("counts days, ages and years", () => {
    expect(daysInMonth(2028, 2)).toBe(29);
    expect(daysInMonth(2026, 2)).toBe(28);
    expect(isoOf(2026, 2, 31)).toBe("2026-02-28");
    expect(ageOn("2008-10-12", "2026-10-11")).toBe(17);
    expect(ageOn("2008-10-11", "2026-10-11")).toBe(18);
    expect(latestBirthDate(18, new Date(2026, 9, 11))).toBe("2008-10-11");
    expect(yearRange(2026, 2024)).toEqual([2026, 2025, 2024]);
    expect(monthNames("fr-CA")[0]).toBe("janvier");
  });

  it("reads, writes and slices times", () => {
    expect(timeToMinutes("09:30")).toBe(570);
    expect(timeToMinutes("24:00")).toBeNull();
    expect(timeSlots("09:00", "10:30", 30)).toEqual(["09:00", "09:30", "10:00"]);
    expect(uses12Hours("en-US")).toBe(true);
    expect(uses12Hours("fr-CA")).toBe(false);
    expect(formatTime("en-US", "18:30")).toBe("6:30 PM");
  });
});

describe("Calendar", () => {
  it("opens the months of the year from its title, and comes back on the month picked", async () => {
    const user = userEvent.setup();
    render(<Calendar locale="en-US" value="2026-10-14" today="2026-10-11" weekStartsOn={0} />);
    await user.click(screen.getByRole("button", { name: /Choose month and year/ }));
    const months = screen.getByRole("grid", { name: "2026" });
    await user.click(within(months).getByRole("button", { name: "March 2026" }));
    expect(screen.getByRole("grid", { name: "March 2026" })).toBeTruthy();
    expect(document.activeElement?.getAttribute("aria-label")).toBe("March 14, 2026");
  });

  it("shows two months for a period, the days between as one band", () => {
    const { container } = render(<Calendar locale="en-US" range={{ start: "2026-10-28", end: "2026-11-03" }} today="2026-10-11" numberOfMonths={2} weekStartsOn={0} />);
    expect(screen.getByRole("grid", { name: "October 2026" })).toBeTruthy();
    expect(screen.getByRole("grid", { name: "November 2026" })).toBeTruthy();
    expect(container.querySelector('[data-band="start"] [data-date="2026-10-28"]')).toBeTruthy();
    expect(container.querySelector('[data-band="end"] [data-date="2026-11-03"]')).toBeTruthy();
    expect(container.querySelectorAll('[data-band="middle"]').length).toBe(5);
  });

  it("marks today with the node", () => {
    const { container } = render(<Calendar locale="en-US" today="2026-10-11" />);
    expect(container.querySelector('[data-date="2026-10-11"] span[aria-hidden]')).toBeTruthy();
  });
});

describe("DateRangePicker", () => {
  it("lights the chosen preset", async () => {
    const user = userEvent.setup();
    render(<DateRangePicker label="Period" locale="en-US" today="2026-10-11" defaultValue={{ start: "2026-10-05", end: "2026-10-11" }} presets={[{ label: "Last 7 days", start: "2026-10-05", end: "2026-10-11" }]} />);
    await user.click(screen.getByRole("button", { name: /Period/ }));
    expect((await screen.findByRole("button", { name: "Last 7 days" })).getAttribute("aria-pressed")).toBe("true");
    expect(screen.getAllByRole("grid")).toHaveLength(2);
  });
});

describe("MonthPicker", () => {
  it("walks the months by row and the years by page, and picks", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = render(<MonthPicker locale="en-US" defaultValue="2026-10" current="2026-10" onValueChange={onValueChange} />);
    expect(await axeViolations(container)).toEqual([]);
    screen.getByRole("button", { name: "October 2026" }).focus();
    await user.keyboard("{ArrowDown}");
    expect(document.activeElement?.textContent).toContain("January 2027");
    await user.keyboard("{PageUp}{Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith("2026-01");
  });
});

describe("DayStrip", () => {
  it("is a radio group of days: the arrows move and pick, disabled days are skipped, marked days say so", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = render(
      <DayStrip
        label="Delivery day"
        locale="en-US"
        start="2026-10-11"
        today="2026-10-11"
        days={7}
        defaultValue="2026-10-12"
        isDateDisabled={(d) => d === "2026-10-13"}
        isDateMarked={(d) => d === "2026-10-15"}
        onValueChange={onValueChange}
      />,
    );
    expect(await axeViolations(container)).toEqual([]);
    const group = screen.getByRole("radiogroup", { name: "Delivery day" });
    expect(within(group).getAllByRole("radio")).toHaveLength(7);
    expect(screen.getByRole("radio", { name: "October 15, 2026, has events" })).toBeTruthy();
    screen.getByRole("radio", { name: "October 12, 2026" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(onValueChange).toHaveBeenLastCalledWith("2026-10-14");
    expect(document.activeElement?.getAttribute("data-date")).toBe("2026-10-14");
  });
});

describe("Wheel", () => {
  it("is a spinbutton: arrows, pages and ends, its value read as words, disabled values skipped", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const options = ["1", "2", "3", "4", "5", "6", "7", "8"].map((v) => ({ value: v, label: `${v} guests`, disabled: v === "3" }));
    const { container } = render(
      <WheelPicker label="Party size">
        <Wheel label="Guests" options={options} defaultValue="2" onValueChange={onValueChange} />
      </WheelPicker>,
    );
    expect(await axeViolations(container)).toEqual([]);
    const spin = screen.getByRole("spinbutton", { name: "Guests" });
    expect(spin.getAttribute("aria-valuetext")).toBe("2 guests");
    spin.focus();
    await user.keyboard("{ArrowDown}");
    expect(onValueChange).toHaveBeenLastCalledWith("4");
    await user.keyboard("{End}");
    expect(onValueChange).toHaveBeenLastCalledWith("8");
    await user.keyboard("{Home}");
    expect(onValueChange).toHaveBeenLastCalledWith("1");
  });
});

describe("TimePicker", () => {
  it("wheels: hours, minutes by a step and the period of a 12-hour locale, an HH:mm value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<TimePicker label="Reminder" locale="en-US" defaultValue="09:30" minuteStep={15} onValueChange={onValueChange} />);
    expect(screen.getByRole("group", { name: "Reminder, 9:30 AM" })).toBeTruthy();
    screen.getByRole("spinbutton", { name: "AM/PM" }).focus();
    await user.keyboard("{ArrowDown}");
    expect(onValueChange).toHaveBeenLastCalledWith("21:30");
    screen.getByRole("spinbutton", { name: "Minutes" }).focus();
    await user.keyboard("{ArrowDown}");
    expect(onValueChange).toHaveBeenLastCalledWith("21:45");
  });

  it("wheels on 24 hours in French", () => {
    render(<TimePicker label="Heure" locale="fr-CA" defaultValue="18:00" labels={{ hours: "Heures", minutes: "Minutes" }} />);
    expect(screen.getByRole("spinbutton", { name: "Heures" }).getAttribute("aria-valuetext")).toBe("18");
    expect(screen.queryByRole("spinbutton", { name: "AM/PM" })).toBeNull();
  });

  it("slots: a radio group by part of the day, taken slots skipped", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = render(
      <TimePicker
        variant="slots"
        label="Appointment"
        locale="en-US"
        slots={timeSlots("11:00", "13:00", 30)}
        isTimeDisabled={(t) => t === "11:30"}
        groupLabels={{ morning: "Morning", afternoon: "Afternoon", evening: "Evening" }}
        onValueChange={onValueChange}
      />,
    );
    expect(await axeViolations(container)).toEqual([]);
    expect(screen.getByRole("group", { name: "Morning" })).toBeTruthy();
    await user.click(screen.getByRole("radio", { name: "11:00 AM" }));
    await user.keyboard("{ArrowRight}");
    expect(onValueChange).toHaveBeenLastCalledWith("12:00");
  });
});

describe("DateField and DateWheel", () => {
  it("DateField: the boxes in the locale's order, the next one focused when full", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = render(<DateField label="Date of birth" locale="en-GB" autoComplete="bday" onValueChange={onValueChange} error="You must be 18 or older." />);
    expect(await axeViolations(container)).toEqual([]);
    const [day, month] = screen.getAllByRole("textbox");
    expect(day?.closest("label")?.textContent).toMatch(/^Day/);
    await user.type(day!, "27");
    expect(document.activeElement).toBe(month);
    await user.type(month!, "3");
    expect(onValueChange).toHaveBeenLastCalledWith("-03-27");
    expect(day?.getAttribute("aria-invalid")).toBe("true");
  });

  it("DateWheel: bounded by max (an age gate), always a real date", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = render(<DateWheel label="Date of birth" locale="en-US" max="2008-10-11" min="1906-01-01" defaultValue="2008-09-30" onValueChange={onValueChange} />);
    expect(await axeViolations(container)).toEqual([]);
    const order = screen.getAllByRole("spinbutton").map((s) => s.getAttribute("aria-label"));
    expect(order).toEqual(["Month", "Day", "Year"]);
    screen.getByRole("spinbutton", { name: "Month" }).focus();
    await user.keyboard("{ArrowDown}");
    expect(onValueChange).toHaveBeenLastCalledWith("2008-10-11");
    expect(screen.getByRole("spinbutton", { name: "Year" }).getAttribute("aria-valuetext")).toBe("2008");
  });
});
