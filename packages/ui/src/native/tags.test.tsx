// Tags and statuses on the phone (#627): a marker beside the name, a closed palette read on the theme, a sheet of moves.
import { describe, expect, jest, test } from "@jest/globals";
import { themes } from "@krizaka/tokens/native";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import * as React from "react";

import { TAG_MARKERS } from "../chip/markers";
import { Chip } from "./chip";
import { StatusChip } from "./status-chip";
import { MarkerPicker, TagChip, TagMarker } from "./tag-chip";
import { TagSelector } from "./tag-selector";
import { ThemeProvider } from "./theme";

const NAMES = { blue: "Blue", green: "Green", amber: "Amber", red: "Red", violet: "Violet", gray: "Gray" };

describe("the theme carries the six markers", () => {
  test("a dot and a text role per name, in both themes", () => {
    for (const mode of [themes.dark, themes.light] as Record<string, string>[]) {
      for (const name of TAG_MARKERS) {
        const key = `tag${name[0]!.toUpperCase()}${name.slice(1)}`;
        expect(mode[key]).toMatch(/^#|^rgba/);
        expect(mode[`${key}Text`]).toMatch(/^#|^rgba/);
      }
    }
  });
});

describe("TagChip", () => {
  test("is named by the tag's name; the marker is hidden from the screen reader", async () => {
    await render(<TagChip marker="violet">Gift cards</TagChip>);
    expect(screen.getByRole("checkbox", { name: "Gift cards" })).toBeOnTheScreen();
    expect(screen.queryByRole("img")).toBeNull();
  });

  test("a marker is painted in the theme's role, a ribbon is a shape", async () => {
    await render(
      <ThemeProvider mode="dark">
        <TagMarker marker="red" />
        <TagMarker marker="green" shape="ribbon" />
      </ThemeProvider>,
    );
    const tree = JSON.stringify(screen.toJSON());
    expect(tree).toContain(themes.dark.tagRed);
    expect(tree).toContain("M0 0H10V14L5 10L0 14Z"); // the ribbon: a rectangle with a notch
  });

  test("works in a group and removable", async () => {
    const values: string[][] = [];
    const removed: string[] = [];
    await render(
      <>
        <Chip.Group type="multiple" aria-label="Tags" onValueChange={(v) => values.push(v)}>
          <TagChip value="late" marker="red">Late payer</TagChip>
        </Chip.Group>
        <TagChip marker="gray" shape="ribbon" removable removeLabel="Remove the tag Winter storage" onRemove={() => removed.push("x")}>Winter storage</TagChip>
      </>,
    );
    await fireEvent.press(screen.getByRole("checkbox", { name: "Late payer" }));
    expect(values).toEqual([["late"]]);
    await fireEvent.press(screen.getByRole("button", { name: "Remove the tag Winter storage" }));
    expect(removed).toHaveLength(1);
  });
});

describe("MarkerPicker", () => {
  test("a radio group of named swatches", async () => {
    const chosen: string[] = [];
    await render(<MarkerPicker label="Colour of the tag" names={NAMES} defaultValue="blue" onValueChange={(m) => chosen.push(m)} />);
    expect(screen.getByLabelText("Colour of the tag").props.role).toBe("radiogroup");
    expect(screen.getAllByRole("radio")).toHaveLength(6);
    expect(screen.getByRole("radio", { name: "Blue" })).toBeChecked();
    await fireEvent.press(screen.getByRole("radio", { name: "Amber" }));
    expect(screen.getByRole("radio", { name: "Amber" })).toBeChecked();
    expect(chosen).toEqual(["amber"]);
  });
});

describe("StatusChip", () => {
  const moves = [{ key: "selected", label: "Selected", confirm: true }, { key: "declined", label: "Declined", reasons: [{ key: "incomplete", label: "Incomplete file" }] }];

  test("without moves it is a read-only badge", async () => {
    await render(<StatusChip label="Paid" tone="success" />);
    expect(screen.getByText("Paid")).toBeOnTheScreen();
    expect(screen.queryByRole("button")).toBeNull();
  });

  test("with moves a press opens the sheet; a reason is picked from the list", async () => {
    const onMove = jest.fn();
    await render(<StatusChip label="To decide" tone="accent" moves={moves} onMove={onMove} />);
    await fireEvent.press(screen.getByRole("button", { name: "Change the status, now To decide" }));
    expect(await screen.findByRole("menuitem", { name: "Selected" })).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole("menuitem", { name: "Declined" }));
    await fireEvent.press(await screen.findByRole("menuitem", { name: "Incomplete file" }));
    expect(onMove).toHaveBeenCalledWith("declined", "incomplete");
  });

  test("a move to confirm asks first", async () => {
    jest.useFakeTimers();
    const onMove = jest.fn();
    await render(<StatusChip label="To decide" moves={moves} onMove={onMove} />);
    await fireEvent.press(screen.getByRole("button", { name: /Change the status/ }));
    await fireEvent.press(await screen.findByRole("menuitem", { name: "Selected" }));
    expect(onMove).not.toHaveBeenCalled();
    await act(async () => jest.runAllTimers());
    await fireEvent.press(await screen.findByRole("menuitem", { name: "Confirm: Selected" }));
    expect(onMove).toHaveBeenCalledWith("selected", null);
    jest.useRealTimers();
  });
});

describe("TagSelector with markers", () => {
  test("an option with a marker is a tag", async () => {
    const values: string[][] = [];
    await render(<TagSelector label="Tags" options={[{ value: "late", label: "Late payer", marker: "red" }, { value: "x", label: "Plain" }]} value={[]} onValueChange={(v) => values.push(v)} />);
    await fireEvent.press(screen.getByRole("checkbox", { name: "Late payer" }));
    expect(values).toEqual([["late"]]);
    expect(screen.getByRole("checkbox", { name: "Plain" })).toBeOnTheScreen();
  });
});
