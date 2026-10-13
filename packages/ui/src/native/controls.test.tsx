// The choice controls of React Native: Switch, RadioGroup, Slider, Select, Combobox, Sheet — and their haptics.
import { describe, expect, jest, test } from "@jest/globals";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import * as React from "react";

import { Combobox, Select } from "./combobox";
import { RadioGroup } from "./radio-group";
import { Slider } from "./slider";
import { Switch } from "./switch";
import { type HapticKind, ThemeProvider } from "./theme";

const withHaptics = (played: HapticKind[], node: React.ReactNode) => <ThemeProvider haptics={(k) => played.push(k)}>{node}</ThemeProvider>;

describe("Switch", () => {
  test("a switch named by its label: it flips, uncontrolled, with a selection haptic", async () => {
    const played: HapticKind[] = [];
    const changes: boolean[] = [];
    await render(withHaptics(played, <Switch label="Push notifications" onCheckedChange={(c) => changes.push(c)} />));
    const control = screen.getByRole("switch", { name: "Push notifications" });
    expect(control).not.toBeChecked();
    await fireEvent.press(control);
    expect(screen.getByRole("switch", { name: "Push notifications" })).toBeChecked();
    expect(changes).toEqual([true]);
    expect(played).toEqual(["selection"]);
  });

  test("a settings row: its label and description drawn, the description read as the hint", async () => {
    await render(<Switch label="Auctions" description="When an auction you follow ends." showLabel checked onCheckedChange={() => undefined} />);
    expect(screen.getByText("When an auction you follow ends.")).toBeTruthy();
    expect(screen.getByRole("switch", { name: "Auctions" }).props.accessibilityHint).toBe("When an auction you follow ends.");
    expect(screen.getByRole("switch", { name: "Auctions" })).toBeChecked();
  });
});

test("a switch alone is a 44-pt target at every size", async () => {
  await render(<Switch label="Compact" size="sm" />);
  const control = screen.getByRole("switch", { name: "Compact" });
  expect(24 + control.props.hitSlop.top + control.props.hitSlop.bottom).toBeGreaterThanOrEqual(44);
});

describe("RadioGroup", () => {
  const sizes = [
    { value: "s", label: "S" },
    { value: "m", label: "M" },
    { value: "l", label: "L", disabled: true },
  ];

  test("a radio group: one checked, a disabled option refused", async () => {
    const changes: string[] = [];
    await render(<RadioGroup label="Size" options={sizes} defaultValue="s" onValueChange={(v) => changes.push(v)} />);
    expect(screen.getByLabelText("Size")).toBeTruthy();
    expect(screen.getByRole("radio", { name: "S" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "L" })).toBeDisabled();
    await fireEvent.press(screen.getByRole("radio", { name: "M" }));
    expect(changes).toEqual(["m"]);
    expect(screen.getByRole("radio", { name: "M" })).toBeChecked();
  });

  test("tactile keys: an impact haptic, the hint part of the name", async () => {
    const played: HapticKind[] = [];
    await render(withHaptics(played, <RadioGroup label="Tip" variant="buttons" options={[{ value: "15", label: "15 %", hint: "$6.30" }]} />));
    await fireEvent.press(screen.getByRole("radio", { name: "15 %, $6.30" }));
    expect(played).toEqual(["impact"]);
  });

  test("cards and segments are radios too, with the error announced", async () => {
    await render(<RadioGroup label="Plan" variant="cards" error="Choose a plan." options={[{ value: "pro", label: "Pro", description: "$12 a month" }]} />);
    expect(screen.getByRole("radio", { name: "Pro, $12 a month" })).toBeTruthy();
    expect(screen.getByRole("alert")).toHaveTextContent("Choose a plan.");
  });
});

describe("Slider", () => {
  test("an adjustable thumb: its value read as words, a step per action, the commit after", async () => {
    const changes: number[] = [];
    const commits: number[] = [];
    await render(<Slider label="Volume" defaultValue={40} step={10} formatValue={(v) => `${v} %`} onValueChange={(v) => changes.push(v)} onValueCommit={(v) => commits.push(v)} />);
    const thumb = screen.getByRole("slider", { name: "Volume" });
    expect(thumb.props["aria-valuetext"]).toBe("40 %");
    await fireEvent(thumb, "accessibilityAction", { nativeEvent: { actionName: "increment" } });
    expect(changes).toEqual([50]);
    expect(commits).toEqual([50]);
  });

  test("a range: two named thumbs that never cross", async () => {
    const changes: [number, number][] = [];
    await render(<Slider<[number, number]> label="Price" thumbLabels={["Minimum", "Maximum"]} defaultValue={[20, 30]} step={10} onValueChange={(v) => changes.push(v)} />);
    await fireEvent(screen.getByRole("slider", { name: "Minimum" }), "accessibilityAction", { nativeEvent: { actionName: "increment" } });
    await fireEvent(screen.getByRole("slider", { name: "Minimum" }), "accessibilityAction", { nativeEvent: { actionName: "increment" } });
    expect(changes).toEqual([[30, 30]]);
  });
});

describe("Select and Combobox", () => {
  const categories = [
    { value: "music", label: "Music" },
    { value: "sport", label: "Sport" },
    { value: "art", label: "Art" },
  ];

  test("Select: the field opens a sheet of radios; picking one closes it", async () => {
    const changes: string[] = [];
    await render(<Select label="Category" placeholder="Choose a category" options={categories} onValueChange={(v) => changes.push(v)} />);
    await fireEvent.press(screen.getByRole("button", { name: "Category, Choose a category" }));
    await fireEvent.press(screen.getByRole("radio", { name: "Sport" }));
    expect(changes).toEqual(["sport"]);
    expect(screen.getByRole("button", { name: "Category, Sport" })).toBeTruthy();
    expect(screen.queryByRole("radio", { name: "Art" })).toBeNull();
  });

  test("Combobox: what is typed filters the options; several values with checkboxes", async () => {
    const changes: (string | string[])[] = [];
    await render(<Combobox label="Interests" multiple options={categories} value={["art"]} onValueChange={(v) => changes.push(v)} />);
    await fireEvent.press(screen.getByRole("button", { name: "Interests, Art" }));
    await fireEvent.changeText(screen.getByLabelText("Search"), "sp");
    expect(screen.queryByRole("checkbox", { name: "Music" })).toBeNull();
    await fireEvent.press(screen.getByRole("checkbox", { name: "Sport" }));
    expect(changes).toEqual([["art", "sport"]]);
  });

  test("Combobox: an async search, debounced", async () => {
    jest.useFakeTimers();
    const queries: string[] = [];
    await render(
      <Combobox
        label="City"
        onSearch={async (q) => {
          queries.push(q);
          return [{ value: "mtl", label: "Montréal" }];
        }}
      />,
    );
    await fireEvent.press(screen.getByRole("button", { name: "City" }));
    await fireEvent.changeText(screen.getByLabelText("Search"), "mon");
    await act(async () => {
      jest.advanceTimersByTime(300);
    });
    expect(queries).toEqual(["mon"]);
    expect(await screen.findByRole("radio", { name: "Montréal" })).toBeTruthy();
    jest.useRealTimers();
  });
});
