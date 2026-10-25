// The words of the admin's editors, in English, and the shape of the ones a product passes translated. Pure data and types: the
// web and React Native editors both read them (/native adds no dependency, so this imports types only).
import type { Label, Marker, StatusTone } from "@krizaka/organize/contract";

import type { Lang } from "./model";

/** A role of the product (`owner`, `manager`…), its key and its name in the person's language. */
export type EditorRole = { key: string; label: string };

/** The tones of a status, in the contract's order. */
export const STATUS_TONES: readonly StatusTone[] = ["neutral", "accent", "success", "warning", "danger"];

export type TagSetEditorLabels = {
  /** The name of the list of presets ("Tags offered"). */
  presets: string;
  /** A preset's name field: `(position) => "Name of tag " + position`. */
  name: (position: number) => string;
  /** A preset's colour group: `(name) => "Colour of the tag " + name`. */
  marker: (name: string) => string;
  /** The name of each colour of the closed palette. */
  markerNames: Readonly<Record<Marker, string>>;
  /** `(name) => "Move " + name + " up"`. */
  moveUp: (name: string) => string;
  /** `(name) => "Move " + name + " down"`. */
  moveDown: (name: string) => string;
  /** `(name) => "Remove " + name`. */
  remove: (name: string) => string;
  /** The handle that drags a row: `(name) => "Drag " + name`. */
  drag: (name: string) => string;
  /** The field that adds a preset ("New tag"). */
  add: string;
  /** Its button ("Add"). */
  addButton: string;
  /** Said on a name another tag has ("Another tag has this name"). */
  duplicate: string;
  /** Said when the list is empty ("No tag offered yet"). */
  empty: string;
  /** The roles that write ("Who can manage tags") and its help. */
  writers: string;
  writersHint: string;
  /** The switch "People can add their own tags" and its help. */
  userTags: string;
  userTagsHint: string;
  /** The most tags ("Most tags") and its help. */
  max: string;
  maxHint: string;
  /** The title of the problems ("To fix before saving"). */
  problems: string;
};

export const tagSetEditorLabels: TagSetEditorLabels = {
  presets: "Tags offered",
  name: (position) => `Name of tag ${position}`,
  marker: (name) => `Colour of the tag ${name}`,
  markerNames: { blue: "Blue", green: "Green", amber: "Amber", red: "Red", violet: "Violet", gray: "Gray" },
  moveUp: (name) => `Move ${name} up`,
  moveDown: (name) => `Move ${name} down`,
  remove: (name) => `Remove ${name}`,
  drag: (name) => `Drag ${name}`,
  add: "New tag",
  addButton: "Add",
  duplicate: "Another tag has this name",
  empty: "No tag offered yet",
  writers: "Who manages the tags",
  writersHint: "These roles create, rename, remove and assign tags.",
  userTags: "People can add their own tags",
  userTagsHint: "Beyond the tags offered here.",
  max: "Most tags",
  maxHint: "Per kind, from 1 to 200.",
  problems: "To fix before saving",
};

export type StatusSetEditorLabels = {
  /** The language of a field, spoken: `{ fr: "French", en: "English" }`. */
  languages: Record<Lang, string>;
  /** A state's label field: `(language, position) => "Label in French of state 2"`. */
  stateLabel: (language: string, position: number) => string;
  /** A state's tone: `(position) => "Tone of state 2"`; and the name of each tone. */
  tone: (position: number) => string;
  tones: Record<StatusTone, string>;
  /** The "final" switch: `(position) => "State 2 is final"`, and what it means. */
  final: (position: number) => string;
  finalHint: string;
  /** The radio of the initial state: `(position) => "State 2 is the initial state"`. */
  initial: (position: number) => string;
  /** Said on the initial state's final switch, which cannot be on ("The initial state is never final"). */
  initialNotFinal: string;
  /** The names of the list ("States, in the order of the column"). */
  states: string;
  /** `(name) => "Move " + name + " up"` etc. */
  moveUp: (name: string) => string;
  moveDown: (name: string) => string;
  remove: (name: string) => string;
  drag: (name: string) => string;
  /** The button that adds a state ("Add a state"), and the label a new state starts with. */
  addState: string;
  newState: Label;
  /** The title of the moves ("Moves") and their help. */
  moves: string;
  movesHint: string;
  /** The group of a state's moves, named by the state: `(name) => `Moves out of ${name}``. */
  from: (name: string) => string;
  /** Said of a final state ("Final: no way out"). */
  noWayOut: string;
  /** A move's button name: `(from, to, roles) => "From A to B: owner"`; `none` says no role may make it. */
  move: (from: string, to: string, roles: string) => string;
  none: string;
  /** The panel of the move chosen: `(from, to) => "Move from A to B"`. */
  moveDetail: (from: string, to: string) => string;
  /** The roles of the move ("Roles that can make this move"). */
  roles: string;
  /** The switch "Ask for a second press". */
  confirm: string;
  /** The reasons ("Reasons to pick from"), the button to add one ("Add a reason") and a reason's fields. */
  reasons: string;
  addReason: string;
  reasonLabel: (language: string, position: number) => string;
  removeReason: (position: number) => string;
  /** Said of a derived set ("Derived: the product computes this status; nobody moves it"). */
  derived: string;
  /** "To fix before saving". */
  problems: string;
};

export const statusSetEditorLabels: StatusSetEditorLabels = {
  languages: { fr: "French", en: "English" },
  stateLabel: (language, position) => `Label in ${language} of state ${position}`,
  tone: (position) => `Tone of state ${position}`,
  tones: { neutral: "Neutral", accent: "Accent", success: "Success", warning: "Warning", danger: "Danger" },
  final: (position) => `State ${position} is final`,
  finalHint: "A final state has no way out.",
  initial: (position) => `State ${position} is the initial state`,
  initialNotFinal: "The initial state is never final.",
  states: "States, in the order of the column",
  moveUp: (name) => `Move ${name} up`,
  moveDown: (name) => `Move ${name} down`,
  remove: (name) => `Remove ${name}`,
  drag: (name) => `Drag ${name}`,
  addState: "Add a state",
  newState: { fr: "New state", en: "New state" },
  moves: "Moves",
  movesHint: "Choose a move to set who can make it, whether it asks for a confirmation, and the reasons to pick from.",
  from: (name) => `Moves from ${name}`,
  noWayOut: "Final: no way out",
  move: (from, to, roles) => `From ${from} to ${to}: ${roles}`,
  none: "nobody",
  moveDetail: (from, to) => `Move from ${from} to ${to}`,
  roles: "Roles that can make this move",
  confirm: "Ask for a second press",
  reasons: "Reasons to pick from",
  addReason: "Add a reason",
  reasonLabel: (language, position) => `Reason ${position} in ${language}`,
  removeReason: (position) => `Remove reason ${position}`,
  derived: "Derived: the product computes this status, and nobody moves it.",
  problems: "To fix before saving",
};

