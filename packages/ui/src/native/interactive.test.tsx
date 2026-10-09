// The primitives with a state: Chip (+ Group), Segmented, Countdown, Progress, Toast.
import { afterEach, beforeEach, describe, expect, jest, test } from "@jest/globals";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import * as React from "react";

import { Chip } from "./chip";
import { Countdown } from "./countdown";
import { Progress } from "./progress";
import { Segmented } from "./segmented";
import { toast, Toaster } from "./toast";

describe("Chip", () => {
  test("alone: a checkbox, uncontrolled", async () => {
    const changes: boolean[] = [];
    await render(<Chip onSelectedChange={(s) => changes.push(s)}>Night</Chip>);
    const chip = screen.getByRole("checkbox", { name: "Night" });
    expect(chip).not.toBeChecked();
    await fireEvent.press(chip);
    expect(screen.getByRole("checkbox", { name: "Night" })).toBeChecked();
    expect(changes).toEqual([true]);
  });

  test("Chip.Group single: radios, one value", async () => {
    const values: string[] = [];
    await render(
      <Chip.Group type="single" defaultValue="all" onValueChange={(v) => values.push(v)} aria-label="Filter">
        <Chip value="all">All</Chip>
        <Chip value="live">Live</Chip>
      </Chip.Group>,
    );
    // A group is a container, not a focusable element: its role and name are on the view.
    expect(screen.getByLabelText("Filter").props.role).toBe("radiogroup");
    expect(screen.getByRole("radio", { name: "All" })).toBeChecked();
    await fireEvent.press(screen.getByRole("radio", { name: "Live" }));
    expect(screen.getByRole("radio", { name: "Live" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "All" })).not.toBeChecked();
    expect(values).toEqual(["live"]);
  });

  test("Chip.Group multiple: checkboxes", async () => {
    const values: string[][] = [];
    await render(
      <Chip.Group type="multiple" value={["a"]} onValueChange={(v) => values.push(v)} scrollable>
        <Chip value="a">A</Chip>
        <Chip value="b">B</Chip>
      </Chip.Group>,
    );
    await fireEvent.press(screen.getByRole("checkbox", { name: "B" }));
    await fireEvent.press(screen.getByRole("checkbox", { name: "A" }));
    expect(values).toEqual([["a", "b"], []]);
  });

  test("removable: its own named remove button", async () => {
    const onRemove = jest.fn();
    await render(
      <Chip removable removeLabel="Remove #night" onRemove={onRemove}>
        #night
      </Chip>,
    );
    await fireEvent.press(screen.getByRole("button", { name: "Remove #night" }));
    expect(onRemove).toHaveBeenCalled();
  });
});

describe("Segmented", () => {
  test("a tab list; the chosen tab is selected; pressing another reports it", async () => {
    const onValueChange = jest.fn();
    await render(
      <Segmented
        aria-label="View"
        value="grid"
        onValueChange={onValueChange}
        options={[
          { value: "grid", label: "Grid" },
          { value: "list", label: "List" },
        ]}
      />,
    );
    expect(screen.getByLabelText("View").props.role).toBe("tablist");
    expect(screen.getByRole("tab", { name: "Grid" })).toBeSelected();
    await fireEvent.press(screen.getByRole("tab", { name: "Grid" }));
    expect(onValueChange).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByRole("tab", { name: "List" }));
    expect(onValueChange).toHaveBeenCalledWith("list");
  });
});

describe("Countdown", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-10-09T12:00:00Z"));
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  const units = { d: "d", h: "h", m: "m", s: "s" };

  test("a timer named by its label and the time left", async () => {
    await render(<Countdown target="2026-10-11T15:30:00Z" units={units} label="Ends in" />);
    expect(screen.getByRole("timer", { name: "Ends in 02d 03h 30m" })).toBeOnTheScreen();
  });

  test("ticks every second, on the server's clock", async () => {
    await render(<Countdown target="2026-10-09T12:00:30Z" skewMs={10_000} units={units} label="Ends in" />);
    expect(screen.getByRole("timer", { name: "Ends in 00h 00m 20s" })).toBeOnTheScreen();
    await act(async () => {
      jest.advanceTimersByTime(5000);
    });
    expect(screen.getByRole("timer", { name: "Ends in 00h 00m 15s" })).toBeOnTheScreen();
  });
});

describe("Progress", () => {
  // The sweep runs on animation frames: fake timers keep it out of the assertions.
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  test("a bar with its value", async () => {
    await render(<Progress value={42} label="Upload" />);
    expect(screen.getByRole("progressbar", { name: "Upload" })).toHaveAccessibilityValue({ min: 0, max: 100, now: 42, text: "42%" });
  });

  test("a ring with a centre and a value in words", async () => {
    await render(
      <Progress variant="ring" size="lg" value={420} max={1000} label="Raised" valueText="$420 of $1,000">
        <></>
      </Progress>,
    );
    expect(screen.getByRole("progressbar", { name: "Raised" })).toHaveAccessibilityValue({ now: 420, max: 1000, text: "$420 of $1,000" });
  });

  test("indeterminate: no value", async () => {
    await render(<Progress label="Processing" />);
    expect(screen.getByRole("progressbar", { name: "Processing" }).props["aria-valuenow"]).toBeUndefined();
  });
});

describe("toast", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(async () => {
    await act(async () => toast.dismiss());
    jest.useRealTimers();
  });

  test("shows, then leaves after its duration", async () => {
    await render(<Toaster closeLabel="Close" duration={3000} />);
    await act(async () => {
      toast.success("Saved", { description: "Your set is live" });
    });
    expect(screen.getByText("Saved")).toBeOnTheScreen();
    expect(screen.getByText("Your set is live")).toBeOnTheScreen();
    await act(async () => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.queryByText("Saved")).toBeNull();
  });

  test("the same id replaces; close and press dismiss; onDismiss once", async () => {
    const onDismiss = jest.fn();
    const onPress = jest.fn();
    await render(<Toaster closeLabel="Close" />);
    await act(async () => {
      toast("First", { id: "n1" });
      toast("Second", { id: "n1", onPress, onDismiss });
    });
    expect(screen.queryByText("First")).toBeNull();
    await fireEvent.press(screen.getByText("Second"));
    expect(onPress).toHaveBeenCalled();
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Second")).toBeNull();
    await act(async () => {
      toast("Third");
    });
    await fireEvent.press(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByText("Third")).toBeNull();
  });

  test("an action button", async () => {
    const undo = jest.fn();
    await render(<Toaster closeLabel="Close" />);
    await act(async () => {
      toast.info("Removed", { action: { label: "Undo", onPress: undo } });
    });
    await fireEvent.press(screen.getByRole("button", { name: "Undo" }));
    expect(undo).toHaveBeenCalled();
    expect(screen.queryByText("Removed")).toBeNull();
  });
});
