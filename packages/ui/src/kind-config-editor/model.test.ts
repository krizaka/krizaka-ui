import { type KindConfig, kindConfigProblems, type Label, type StatusSet,statusSetProblems } from "@krizaka/organize/contract";

import {
  addPreset,
  addReason,
  addState,
  clampMax,
  duplicatePresetNames,
  freshKey,
  move,
  movePreset,
  recolorPreset,
  removePreset,
  removeState,
  renamePreset,
  setFinal,
  setInitial,
  setStateLabel,
  setStateTone,
  setTransitionConfirm,
  setTransitionReasons,
  setTransitionRoles,
  type TagSetValue,
  toggleRole,
  transitionOf,
} from "./model";

const label = (fr: string, en: string): Label => ({ fr, en });
const tags: TagSetValue = { writers: ["owner"], userTags: true, max: 50, presets: { default: [{ name: "Regular", marker: "blue" }, { name: "Late payer", marker: "red" }] } };
const set: StatusSet = {
  key: "applicant_file", label: label("Dossier", "File"), mode: "editable", initial: "to_decide",
  states: [
    { key: "to_decide", label: label("À décider", "To decide"), tone: "accent" },
    { key: "selected", label: label("Retenu", "Selected"), tone: "success", final: true },
    { key: "declined", label: label("Non retenu", "Declined"), tone: "neutral", final: true },
  ],
  transitions: [{ from: "to_decide", to: "selected", roles: ["owner"] }, { from: "to_decide", to: "declined", roles: ["owner", "manager"] }],
};
const config = (tagSet: TagSetValue, status: StatusSet | null): KindConfig => ({ kind: "client", tags: tagSet, status, views: [] });

describe("the editors' model keeps the contract by construction", () => {
  it("is valid before and after every change the editors make", () => {
    expect(kindConfigProblems(config(tags, set))).toEqual([]);
    let t = addPreset(tags, "default", "  Pick-up ", "green");
    t = recolorPreset(t, "default", 0, "violet");
    t = renamePreset(t, "default", 1, "Late");
    t = movePreset(t, "default", 2, 0);
    t = removePreset(t, "default", 1);
    expect(kindConfigProblems(config(t, null))).toEqual([]);
    expect(t.presets.default!.map((p) => p.name)).toEqual(["Pick-up", "Late"]);
    let s = addState(set, label("Nouvel état", "New state"));
    s = setStateLabel(s, "state_4", "fr", "À relancer");
    s = setStateTone(s, "state_4", "warning");
    s = setTransitionRoles(s, "to_decide", "state_4", ["owner"]);
    s = setTransitionConfirm(s, "to_decide", "state_4", true);
    s = addReason(s, "to_decide", "state_4", label("Raison", "Reason"));
    expect(statusSetProblems(s)).toEqual([]);
    s = removeState(s, "state_4");
    expect(s.transitions.some((x) => x.to === "state_4")).toBe(false);
    expect(statusSetProblems(s)).toEqual([]);
  });

  it("loses no field on a round trip through JSON", () => {
    const s = addReason(setTransitionConfirm(set, "to_decide", "selected", true), "to_decide", "declined", label("Dossier incomplet", "Incomplete file"));
    expect(JSON.parse(JSON.stringify(s))).toEqual(s);
    expect(transitionOf(s, "to_decide", "selected")?.confirm).toBe(true);
    expect(transitionOf(s, "to_decide", "declined")?.reasons).toEqual([{ key: "reason_1", label: label("Dossier incomplet", "Incomplete file") }]);
  });

  it("never mutates its input", () => {
    const frozen = structuredClone(set);
    setFinal(set, "to_decide", false);
    removeState(set, "selected");
    setTransitionRoles(set, "to_decide", "selected", []);
    expect(set).toEqual(frozen);
  });
});

describe("tags", () => {
  it("refuses an empty name and a twin (case ignored), keeps the order, moves by index", () => {
    expect(addPreset(tags, "default", "   ", "blue")).toBe(tags);
    expect(addPreset(tags, "default", "REGULAR", "green")).toBe(tags);
    expect(addPreset(tags, "trade", "Regular", "green").presets.trade).toEqual([{ name: "Regular", marker: "green" }]);
    expect(movePreset(tags, "default", 0, 1).presets.default!.map((p) => p.name)).toEqual(["Late payer", "Regular"]);
    expect(movePreset(tags, "default", 0, 9)).toEqual(tags);
  });

  it("finds the names a variant has twice, to mark them in place", () => {
    expect([...duplicatePresetNames([{ name: "A", marker: "blue" }, { name: "b", marker: "red" }, { name: " a ", marker: "gray" }])]).toEqual([0, 2]);
  });

  it("keeps the max inside the contract's 1 to 200 and toggles roles", () => {
    expect(clampMax(0)).toBe(1);
    expect(clampMax(999)).toBe(200);
    expect(clampMax(Number.NaN)).toBe(1);
    expect(clampMax(12.4)).toBe(12);
    expect(toggleRole(["owner"], "manager")).toEqual(["owner", "manager"]);
    expect(toggleRole(["owner", "manager"], "owner")).toEqual(["manager"]);
  });
});

describe("statuses", () => {
  it("a final state cannot get an outgoing transition, and making a state final drops its moves out", () => {
    expect(setTransitionRoles(set, "selected", "to_decide", ["owner"])).toBe(set);
    const reopened = setFinal(set, "selected", false);
    const withExit = setTransitionRoles(reopened, "selected", "to_decide", ["owner"]);
    expect(transitionOf(withExit, "selected", "to_decide")).toBeTruthy();
    const closed = setFinal(withExit, "selected", true);
    expect(closed.transitions.some((t) => t.from === "selected")).toBe(false);
    expect(statusSetProblems(closed)).toEqual([]);
  });

  it("the initial state is never final, and a final state is never the initial one", () => {
    expect(setFinal(set, "to_decide", true)).toBe(set);
    expect(setInitial(set, "selected")).toBe(set);
    expect(setInitial(set, "unknown")).toBe(set);
    const changed = setInitial(setFinal(set, "selected", false), "selected");
    expect(changed.initial).toBe("selected");
  });

  it("removing the initial state falls back to the first state that is not final", () => {
    const open = setFinal(set, "selected", false);
    expect(removeState(open, "to_decide").initial).toBe("selected");
    expect(removeState(set, "to_decide").initial).toBeUndefined();
  });

  it("refuses a move onto itself, and no role removes the move", () => {
    expect(setTransitionRoles(set, "to_decide", "to_decide", ["owner"])).toBe(set);
    expect(transitionOf(setTransitionRoles(set, "to_decide", "selected", []), "to_decide", "selected")).toBeUndefined();
  });

  it("reasons are a list of data (off by default), removable as a whole", () => {
    expect(transitionOf(set, "to_decide", "selected")?.reasons).toBeUndefined();
    const withReason = addReason(set, "to_decide", "declined", label("Autre candidat", "Another applicant"));
    expect(transitionOf(withReason, "to_decide", "declined")?.reasons).toHaveLength(1);
    expect(transitionOf(setTransitionReasons(withReason, "to_decide", "declined", []), "to_decide", "declined")).not.toHaveProperty("reasons");
  });

  it("states: at most 12, in an order that moves, with fresh keys", () => {
    let s = set;
    for (let i = 0; i < 20; i++) s = addState(s, label("N", "N"));
    expect(s.states).toHaveLength(12);
    expect(new Set(s.states.map((x) => x.key)).size).toBe(12);
    expect(statusSetProblems(s).filter((p) => !p.includes("transitions"))).toEqual([]);
    expect(freshKey(["state_1", "state_2"])).toBe("state_3");
    expect(move([1, 2, 3], 2, 0)).toEqual([3, 1, 2]);
    expect(move([1, 2, 3], 0, 5)).toEqual([1, 2, 3]);
  });
});
