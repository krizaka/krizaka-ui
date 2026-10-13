// The dates and times of React Native: Wheel, TimePicker, DayStrip, Calendar, MonthPicker, DateWheel — and the haptics.
import { describe, expect, test } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";
import * as React from "react";

import { Calendar, DateWheel, DayStrip, MonthPicker, TimePicker } from "./date-time";
import { type HapticKind, ThemeProvider } from "./theme";
import { Wheel, WheelPicker } from "./wheel";

const guests = ["1", "2", "3", "4"].map((v) => ({ value: v, label: `${v} guests`, disabled: v === "3" }));

describe("Wheel", () => {
  test("an adjustable control: its value read as words, the actions step over a disabled value", async () => {
    const changes: string[] = [];
    await render(
      <WheelPicker label="Party size">
        <Wheel label="Guests" options={guests} defaultValue="2" onValueChange={(v) => changes.push(v)} />
      </WheelPicker>,
    );
    const wheel = screen.getByRole("spinbutton", { name: "Guests" });
    expect(wheel.props["aria-valuetext"]).toBe("2 guests");
    await fireEvent(wheel, "accessibilityAction", { nativeEvent: { actionName: "increment" } });
    expect(changes).toEqual(["4"]);
    expect(screen.getByRole("spinbutton", { name: "Guests" }).props["aria-valuetext"]).toBe("4 guests");
  });

  test("a value passed by the hand plays a selection haptic, the rest commits it", async () => {
    const played: HapticKind[] = [];
    const changes: string[] = [];
    await render(
      <ThemeProvider haptics={(k) => played.push(k)}>
        <WheelPicker label="Party size">
          <Wheel label="Guests" options={guests} defaultValue="1" onValueChange={(v) => changes.push(v)} />
        </WheelPicker>
      </ThemeProvider>,
    );
    // The wheel's list: the scroll view inside the adjustable control.
    const list = screen.getByRole("spinbutton", { name: "Guests" }).children[0] as Parameters<typeof fireEvent.scroll>[0];
    await fireEvent.scroll(list, { nativeEvent: { contentOffset: { x: 0, y: 44 } } });
    expect(played).toEqual(["selection"]);
    await fireEvent(list, "momentumScrollEnd", { nativeEvent: { contentOffset: { x: 0, y: 44 } } });
    expect(changes).toEqual(["2"]);
  });
});

describe("TimePicker", () => {
  test("wheels on 12 hours in en-US: the period changes the hour, the value stays HH:mm", async () => {
    const changes: string[] = [];
    await render(<TimePicker label="Reminder" locale="en-US" defaultValue="09:30" minuteStep={15} onValueChange={(v) => changes.push(v)} />);
    expect(screen.getByLabelText("Reminder, 9:30 AM")).toBeTruthy();
    await fireEvent(screen.getByRole("spinbutton", { name: "AM/PM" }), "accessibilityAction", { nativeEvent: { actionName: "increment" } });
    expect(changes).toEqual(["21:30"]);
  });

  test("slots: a radio group, taken slots disabled", async () => {
    const changes: string[] = [];
    await render(<TimePicker variant="slots" label="Appointment" locale="en-US" slots={["09:00", "09:30", "10:00"]} isTimeDisabled={(t) => t === "09:30"} onValueChange={(v) => changes.push(v)} />);
    expect(screen.getByRole("radio", { name: "9:30 AM" })).toBeDisabled();
    await fireEvent.press(screen.getByRole("radio", { name: "10:00 AM" }));
    expect(changes).toEqual(["10:00"]);
    expect(screen.getByRole("radio", { name: "10:00 AM" })).toBeChecked();
  });
});

describe("DayStrip", () => {
  test("days as radios, named by their full date; marked days say so", async () => {
    const changes: string[] = [];
    await render(<DayStrip label="Delivery day" locale="en-US" start="2026-10-11" today="2026-10-11" days={5} isDateMarked={(d) => d === "2026-10-13"} markedLabel="has a session" onValueChange={(v) => changes.push(v)} />);
    expect(screen.getAllByRole("radio")).toHaveLength(5);
    await fireEvent.press(screen.getByRole("radio", { name: "October 13, 2026, has a session" }));
    expect(changes).toEqual(["2026-10-13"]);
  });
});

describe("Calendar and MonthPicker", () => {
  test("Calendar: days named by their date, out of bounds disabled, months turned by the buttons", async () => {
    const picked: string[] = [];
    await render(<Calendar locale="en-US" value="2026-10-14" today="2026-10-11" min="2026-10-11" onSelect={(d) => picked.push(d)} />);
    expect(screen.getByRole("radio", { name: "October 10, 2026" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Previous month" })).toBeDisabled();
    await fireEvent.press(screen.getByRole("radio", { name: "October 20, 2026" }));
    expect(picked).toEqual(["2026-10-20"]);
    await fireEvent.press(screen.getByRole("button", { name: "Next month" }));
    expect(screen.getByText("November 2026")).toBeTruthy();
  });

  test("MonthPicker: twelve radios, the later months refused", async () => {
    const picked: string[] = [];
    await render(<MonthPicker locale="en-US" value="2026-09" max="2026-10" onValueChange={(m) => picked.push(m)} />);
    expect(screen.getByRole("radio", { name: "September 2026" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "November 2026" })).toBeDisabled();
    await fireEvent.press(screen.getByRole("radio", { name: "March 2026" }));
    expect(picked).toEqual(["2026-03"]);
  });
});

describe("DateWheel", () => {
  test("three wheels in the locale's order, bounded by max: never past the 18th birthday", async () => {
    const changes: string[] = [];
    await render(<DateWheel label="Date of birth" locale="en-GB" max="2008-10-11" defaultValue="2008-09-30" onValueChange={(v) => changes.push(v)} error="You must be 18 or older." />);
    expect(screen.getAllByRole("spinbutton").map((w) => w.props["aria-label"])).toEqual(["Day", "Month", "Year"]);
    await fireEvent(screen.getByRole("spinbutton", { name: "Month" }), "accessibilityAction", { nativeEvent: { actionName: "increment" } });
    expect(changes).toEqual(["2008-10-11"]);
    expect(screen.getByRole("alert")).toHaveTextContent("You must be 18 or older.");
  });
});
