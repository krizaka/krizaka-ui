import { type KindConfig, kindConfigProblems, type StatusSet, statusSetProblems } from "@krizaka/organize/contract";
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";

import { axeViolations } from "../test/axe";
import { StatusSetEditor, TagSetEditor, type TagSetValue } from "./index";

const ROLES = [{ key: "owner", label: "Owner" }, { key: "manager", label: "Manager" }];
const label = (fr: string, en: string) => ({ fr, en });

const TAGS: TagSetValue = { writers: ["owner"], userTags: false, max: 30, presets: { default: [{ name: "Regular", marker: "blue" }, { name: "Late payer", marker: "red" }] } };
const SET: StatusSet = {
  key: "applicant_file", label: label("Dossier", "File"), mode: "editable", initial: "to_decide",
  states: [
    { key: "to_decide", label: label("À décider", "To decide"), tone: "accent" },
    { key: "selected", label: label("Retenu", "Selected"), tone: "success", final: true },
    { key: "declined", label: label("Non retenu", "Declined"), tone: "neutral", final: true },
  ],
  transitions: [{ from: "to_decide", to: "selected", roles: ["owner"], confirm: true }],
};

/** Holds the value like a product does, and keeps every value handed back. */
function Tags({ seen, problems }: { seen: TagSetValue[]; problems?: string[] }) {
  const [value, setValue] = React.useState(TAGS);
  return <TagSetEditor value={value} variant="default" roles={ROLES} problems={problems} onChange={(next) => { seen.push(next); setValue(next); }} />;
}
function Status({ seen, initial = SET }: { seen: StatusSet[]; initial?: StatusSet }) {
  const [value, setValue] = React.useState(initial);
  return <StatusSetEditor value={value} roles={ROLES} onChange={(next) => { seen.push(next); setValue(next); }} />;
}

/** The accessible names of every control of a tree. */
const names = (root: HTMLElement) =>
  // A swatch is named by its colour inside a group named by its tag: the group is the unique part.
  [...root.querySelectorAll<HTMLElement>("input, select, button, [role=switch]")].filter((el) => !el.closest("[role=radiogroup]")).map((el) => el.getAttribute("aria-label") ?? el.textContent ?? "");

describe("TagSetEditor (#690)", () => {
  it("gives every control its own name and leaves no axe violation", async () => {
    const { container } = render(<Tags seen={[]} />);
    const all = names(container).filter(Boolean);
    expect(new Set(all).size).toBe(all.length);
    expect(screen.getByRole("textbox", { name: "Name of tag 1" })).toBeTruthy();
    expect(screen.getByRole("radiogroup", { name: "Colour of the tag Regular" })).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("hands back the whole descriptor on every change, no field lost, valid for the contract", async () => {
    const user = userEvent.setup();
    const seen: TagSetValue[] = [];
    render(<Tags seen={seen} />);
    await user.type(screen.getByRole("textbox", { name: "New tag" }), "Gift cards{Enter}");
    await user.click(within(screen.getByRole("radiogroup", { name: "Colour of the tag Gift cards" })).getByRole("radio", { name: "Violet" }));
    await user.click(screen.getByRole("button", { name: "Move Gift cards up" }));
    await user.click(screen.getByRole("button", { name: "Remove Late payer" }));
    await user.click(screen.getByRole("button", { name: "Manager" }));
    await user.click(screen.getByRole("switch", { name: "People can add their own tags" }));
    const last = seen.at(-1)!;
    expect(last.presets.default).toEqual([{ name: "Regular", marker: "blue" }, { name: "Gift cards", marker: "violet" }]);
    expect(last.writers).toEqual(["owner", "manager"]);
    expect(last.userTags).toBe(true);
    expect(last.max).toBe(30);
    const config: KindConfig = { kind: "client", tags: last, status: null, views: [] };
    expect(kindConfigProblems(config)).toEqual([]);
  });

  it("reorders from the keyboard with Alt + arrows, the focus staying on the moved name", async () => {
    const user = userEvent.setup();
    const seen: TagSetValue[] = [];
    render(<Tags seen={seen} />);
    screen.getByRole("textbox", { name: "Name of tag 1" }).focus();
    await user.keyboard("{Alt>}{ArrowDown}{/Alt}");
    expect(seen.at(-1)!.presets.default!.map((p) => p.name)).toEqual(["Late payer", "Regular"]);
    await act(async () => {
      await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));
    });
    expect((document.activeElement as HTMLInputElement).value).toBe("Regular");
  });

  it("marks a name another tag has, and refuses to add a twin", async () => {
    const user = userEvent.setup();
    const seen: TagSetValue[] = [];
    render(<Tags seen={seen} />);
    const second = screen.getByRole("textbox", { name: "Name of tag 2" });
    await user.clear(second);
    await user.type(second, "regular");
    expect(second.getAttribute("aria-invalid")).toBe("true");
    expect(screen.getAllByText("Another tag has this name")).toHaveLength(2);
    const before = seen.length;
    await user.type(screen.getByRole("textbox", { name: "New tag" }), "REGULAR{Enter}");
    expect(seen).toHaveLength(before);
  });

  it("keeps the most inside 1 to 200 when the field is left", async () => {
    const user = userEvent.setup();
    const seen: TagSetValue[] = [];
    render(<Tags seen={seen} />);
    const max = screen.getByRole("spinbutton", { name: "Most tags" });
    await user.clear(max);
    await user.type(max, "999");
    await user.tab();
    expect(seen.at(-1)!.max).toBe(200);
  });

  it("shows the server's problems in place", () => {
    render(<Tags seen={[]} problems={["tags.max: 1 to 200"]} />);
    expect(within(screen.getByRole("alert")).getByText("tags.max: 1 to 200")).toBeTruthy();
  });
});

describe("StatusSetEditor (#690)", () => {
  it("every control has a unique label, and FR / EN pairs say their language", async () => {
    const { container } = render(<Status seen={[]} />);
    const all = names(container).filter(Boolean);
    expect(new Set(all).size).toBe(all.length);
    expect(screen.getByRole("textbox", { name: "Label in French of state 1" })).toBeTruthy();
    expect(screen.getByRole("textbox", { name: "Label in English of state 1" })).toBeTruthy();
    expect(screen.getByRole("textbox", { name: "Label in French of state 1" }).getAttribute("lang")).toBe("fr");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("edits labels in each language, the tone and the order (buttons and Alt + arrows), without losing a field", async () => {
    const user = userEvent.setup();
    const seen: StatusSet[] = [];
    render(<Status seen={seen} />);
    const en = screen.getByRole("textbox", { name: "Label in English of state 1" });
    await user.clear(en);
    await user.type(en, "Undecided");
    await user.selectOptions(screen.getByRole("combobox", { name: "Tone of state 1" }), "warning");
    await user.click(screen.getByRole("button", { name: "Move Selected up" }));
    const last = seen.at(-1)!;
    expect(last.states.map((s) => s.key)).toEqual(["selected", "to_decide", "declined"]);
    expect(last.states.find((s) => s.key === "to_decide")).toMatchObject({ label: { fr: "À décider", en: "Undecided" }, tone: "warning" });
    expect(statusSetProblems(last)).toEqual([]);
    screen.getByRole("textbox", { name: "Label in English of state 1" }).focus();
    await user.keyboard("{Alt>}{ArrowDown}{/Alt}");
    expect(seen.at(-1)!.states.map((s) => s.key)).toEqual(["to_decide", "selected", "declined"]);
  });

  it("a final state's row has no moves out; the initial state's final switch rests and says why", () => {
    render(<Status seen={[]} />);
    const group = screen.getByRole("group", { name: "Moves from Selected" });
    expect(within(group).queryByRole("button")).toBeNull();
    expect(within(group).getByText("Final: no way out")).toBeTruthy();
    const initialSwitch = screen.getByRole("switch", { name: "State 1 is final" });
    expect((initialSwitch as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByRole("radio", { name: "State 1 is the initial state" }).hasAttribute("checked") || (screen.getByRole("radio", { name: "State 1 is the initial state" }) as HTMLInputElement).checked).toBe(true);
    expect((screen.getByRole("radio", { name: "State 2 is the initial state" }) as HTMLInputElement).disabled).toBe(true);
  });

  it("making a state final drops its moves out: a final state cannot keep an outgoing transition", async () => {
    const user = userEvent.setup();
    const seen: StatusSet[] = [];
    render(<Status seen={seen} initial={{ ...SET, states: SET.states.map((s) => (s.key === "declined" ? { ...s, final: false } : s)), transitions: [...SET.transitions, { from: "declined", to: "to_decide", roles: ["owner"] }] }} />);
    await user.click(screen.getByRole("switch", { name: "State 3 is final" }));
    const last = seen.at(-1)!;
    expect(last.transitions.some((t) => t.from === "declined")).toBe(false);
    expect(statusSetProblems(last)).toEqual([]);
    expect(within(screen.getByRole("group", { name: "Moves from Declined" })).getByText("Final: no way out")).toBeTruthy();
  });

  it("sets who can make a move, its confirmation and its reasons; no role removes the move", async () => {
    const user = userEvent.setup();
    const seen: StatusSet[] = [];
    render(<Status seen={seen} />);
    const from = screen.getByRole("group", { name: "Moves from To decide" });
    await user.click(within(from).getByRole("button", { name: "From To decide to Declined: nobody" }));
    const panel = screen.getByRole("region", { name: "Move from To decide to Declined" });
    expect(within(panel).queryByRole("switch")).toBeNull();
    expect(seen).toHaveLength(0);
    await user.click(within(panel).getByRole("button", { name: "Manager" }));
    expect(seen.at(-1)!.transitions.find((t) => t.to === "declined")?.roles).toEqual(["manager"]);
    expect(within(screen.getByRole("region", { name: "Move from To decide to Declined" })).getByRole("switch", { name: "Ask for a second press" })).toBeTruthy();
  });

  it("opens a move that exists and edits it in place", async () => {
    const user = userEvent.setup();
    const seen: StatusSet[] = [];
    render(<Status seen={seen} />);
    await user.click(screen.getByRole("button", { name: "From To decide to Selected: Owner" }));
    const panel = screen.getByRole("region", { name: "Move from To decide to Selected" });
    await user.click(within(panel).getByRole("button", { name: "Manager" }));
    expect(seen.at(-1)!.transitions[0]!.roles).toEqual(["owner", "manager"]);
    await user.click(within(panel).getByRole("switch", { name: "Ask for a second press" }));
    expect(seen.at(-1)!.transitions[0]!.confirm).toBeUndefined();
    await user.click(within(panel).getByRole("button", { name: "Add a reason" }));
    const fr = within(panel).getByRole("textbox", { name: "Reason 1 in French" });
    const en = within(panel).getByRole("textbox", { name: "Reason 1 in English" });
    await user.type(fr, "Autre candidat");
    await user.type(en, "Another applicant");
    const withReason = seen.at(-1)!;
    expect(withReason.transitions[0]!.reasons).toEqual([{ key: "reason_1", label: label("Autre candidat", "Another applicant") }]);
    expect(statusSetProblems(withReason)).toEqual([]);
    await user.click(within(panel).getByRole("button", { name: "Remove reason 1" }));
    expect(seen.at(-1)!.transitions[0]).not.toHaveProperty("reasons");
    await user.click(within(panel).getByRole("button", { name: "Owner" }));
    await user.click(within(panel).getByRole("button", { name: "Manager" }));
    expect(seen.at(-1)!.transitions).toEqual([]);
    expect(within(panel).queryByRole("switch")).toBeNull();
  });

  it("adds a state with a fresh key and removes one with its moves", async () => {
    const user = userEvent.setup();
    const seen: StatusSet[] = [];
    render(<Status seen={seen} />);
    await user.click(screen.getByRole("button", { name: "Add a state" }));
    expect(seen.at(-1)!.states.at(-1)).toMatchObject({ key: "state_4", tone: "neutral" });
    await user.click(screen.getByRole("button", { name: "Remove Selected" }));
    const last = seen.at(-1)!;
    expect(last.states.some((s) => s.key === "selected")).toBe(false);
    expect(last.transitions).toEqual([]);
    expect(statusSetProblems(last)).toEqual([]);
  });

  it("shows a derived set read-only, with no moves to edit", async () => {
    const { container } = render(<StatusSetEditor value={{ ...SET, mode: "derived", initial: undefined, transitions: [] }} roles={ROLES} onChange={() => {}} />);
    expect(screen.getByText(/Derived: the product computes/)).toBeTruthy();
    expect(container.querySelector("input, button, select")).toBeNull();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("shows the server's problems in place and translates through labels", () => {
    render(<StatusSetEditor value={SET} roles={ROLES} problems={["initial: never a final state"]} labels={{ addState: "Ajouter un état", problems: "À corriger" }} onChange={() => {}} />);
    expect(screen.getByRole("alert").textContent).toContain("initial: never a final state");
    expect(screen.getByText("À corriger")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Ajouter un état" })).toBeTruthy();
  });
});
