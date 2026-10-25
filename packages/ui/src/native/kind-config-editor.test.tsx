// The admin's editors on the phone (#690): the web's props, the same pure changes.
import { describe, expect, test } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";
import * as React from "react";

import { StatusSetEditor, TagSetEditor, type TagSetValue } from "./kind-config-editor";

type Status = React.ComponentProps<typeof StatusSetEditor>["value"];
const ROLES = [{ key: "owner", label: "Owner" }, { key: "manager", label: "Manager" }];
const label = (fr: string, en: string) => ({ fr, en });
const TAGS: TagSetValue = { writers: ["owner"], userTags: false, max: 30, presets: { default: [{ name: "Regular", marker: "blue" }, { name: "Late payer", marker: "red" }] } };
const SET: Status = {
  key: "applicant_file", label: label("Dossier", "File"), mode: "editable", initial: "to_decide",
  states: [{ key: "to_decide", label: label("À décider", "To decide"), tone: "accent" }, { key: "selected", label: label("Retenu", "Selected"), tone: "success", final: true }],
  transitions: [{ from: "to_decide", to: "selected", roles: ["owner"] }],
};

describe("TagSetEditor", () => {
  test("hands back the whole descriptor: add, recolour, reorder, remove, roles, switch", async () => {
    const seen: TagSetValue[] = [];
    function Harness() {
      const [value, setValue] = React.useState(TAGS);
      return <TagSetEditor value={value} variant="default" roles={ROLES} onChange={(next) => { seen.push(next); setValue(next); }} />;
    }
    await render(<Harness />);
    expect(screen.getByLabelText("Name of tag 1")).toBeOnTheScreen();
    await fireEvent.changeText(screen.getByLabelText("New tag"), "Gift cards");
    await fireEvent.press(screen.getByRole("button", { name: "Add" }));
    expect(seen.at(-1)!.presets.default!.map((p) => p.name)).toEqual(["Regular", "Late payer", "Gift cards"]);
    await fireEvent.press(screen.getAllByRole("radio", { name: "Violet" })[2]!);
    expect(seen.at(-1)!.presets.default![2]!.marker).toBe("violet");
    await fireEvent.press(screen.getByRole("button", { name: "Move Gift cards up" }));
    expect(seen.at(-1)!.presets.default!.map((p) => p.name)).toEqual(["Regular", "Gift cards", "Late payer"]);
    await fireEvent.press(screen.getByRole("button", { name: "Remove Late payer" }));
    await fireEvent.press(screen.getByRole("checkbox", { name: "Manager" }));
    expect(seen.at(-1)!.writers).toEqual(["owner", "manager"]);
    expect(seen.at(-1)!.max).toBe(30);
    expect(seen.at(-1)!.presets.default!.map((p) => p.name)).toEqual(["Regular", "Gift cards"]);
  });

  test("shows the server's problems and marks a twin name", async () => {
    await render(<TagSetEditor value={{ ...TAGS, presets: { default: [{ name: "A", marker: "blue" }, { name: "a", marker: "red" }] } }} variant="default" roles={ROLES} problems={["tags.max: 1 to 200"]} onChange={() => {}} />);
    expect(screen.getByText("• tags.max: 1 to 200")).toBeOnTheScreen();
    expect(screen.getAllByText("Another tag has this name")).toHaveLength(2);
  });
});

describe("StatusSetEditor", () => {
  test("edits labels in each language and the order; a final state has no way out", async () => {
    const seen: Status[] = [];
    function Harness() {
      const [value, setValue] = React.useState(SET);
      return <StatusSetEditor value={value} roles={ROLES} onChange={(next) => { seen.push(next); setValue(next); }} />;
    }
    await render(<Harness />);
    expect(screen.getByLabelText("Label in French of state 1")).toBeOnTheScreen();
    expect(screen.getByLabelText("Label in English of state 1")).toBeOnTheScreen();
    await fireEvent.changeText(screen.getByLabelText("Label in English of state 1"), "Undecided");
    expect(seen.at(-1)!.states[0]!.label).toEqual({ fr: "À décider", en: "Undecided" });
    await fireEvent.press(screen.getByRole("button", { name: "Move Selected up" }));
    expect(seen.at(-1)!.states.map((s) => s.key)).toEqual(["selected", "to_decide"]);
    expect(screen.getByText("Final: no way out")).toBeOnTheScreen();
  });

  test("opens a move, sets its roles, and removing every role removes the move", async () => {
    const seen: Status[] = [];
    function Harness() {
      const [value, setValue] = React.useState(SET);
      return <StatusSetEditor value={value} roles={ROLES} onChange={(next) => { seen.push(next); setValue(next); }} />;
    }
    await render(<Harness />);
    await fireEvent.press(screen.getByRole("checkbox", { name: "From To decide to Selected: Owner" }));
    expect(screen.getByLabelText("Move from To decide to Selected")).toBeOnTheScreen();
    await fireEvent.press(screen.getAllByRole("checkbox", { name: "Manager" })[0]!);
    expect(seen.at(-1)!.transitions[0]!.roles).toEqual(["owner", "manager"]);
    await fireEvent.press(screen.getAllByRole("checkbox", { name: "Owner" }).at(-1)!);
    await fireEvent.press(screen.getAllByRole("checkbox", { name: "Manager" }).at(-1)!);
    expect(seen.at(-1)!.transitions).toEqual([]);
  });

  test("a derived set is read-only", async () => {
    await render(<StatusSetEditor value={{ ...SET, mode: "derived", initial: undefined, transitions: [] }} roles={ROLES} onChange={() => {}} />);
    expect(screen.getByText(/Derived: the product computes/)).toBeOnTheScreen();
    expect(screen.queryByRole("button")).toBeNull();
  });
});
