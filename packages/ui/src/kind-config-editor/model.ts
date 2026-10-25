// The pure changes of the admin's editors (krizaka-ts#89, `@krizaka/organize/contract`): each takes a descriptor and gives a new one,
// never mutating, never throwing. The rules of the contract that the editors can keep by construction are kept here — a final state has
// no way out, the initial state is never final, a move goes to another state, a transition exists when a role may make it — and the
// rest (`kindConfigProblems`) is shown by the editor in place. Shared by the web and React Native editors; imports types only.
import type { Label, Marker, StatusSet, StatusState, StatusTone, StatusTransition, TagPreset } from "@krizaka/organize/contract";

/** The `tags` part of a `KindConfig`. */
export type TagSetValue = {
  writers: string[];
  userTags: boolean;
  max: number;
  presets: Record<string, TagPreset[]>;
};

/** The language of a label. */
export type Lang = keyof Label;

/** A list with the item at `from` put at `to` (the same list when either is out of range). */
export function move<T>(list: readonly T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) return [...list];
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item as T);
  return next;
}

// --- tags ------------------------------------------------------------------------------------------------------------------

const presetsOf = (tags: TagSetValue, variant: string): TagPreset[] => tags.presets[variant] ?? [];
const withPresets = (tags: TagSetValue, variant: string, list: TagPreset[]): TagSetValue => ({ ...tags, presets: { ...tags.presets, [variant]: list } });

/** A name as the contract keeps it: spaces collapsed, trimmed. */
export const cleanName = (raw: string) => raw.replace(/\s+/g, " ").trim();

/** Adds a preset at the end — refused (same value) for an empty name or one the variant already has (case ignored). */
export function addPreset(tags: TagSetValue, variant: string, name: string, marker: Marker): TagSetValue {
  const clean = cleanName(name);
  if (!clean || presetsOf(tags, variant).some((p) => p.name.toLocaleLowerCase() === clean.toLocaleLowerCase())) return tags;
  return withPresets(tags, variant, [...presetsOf(tags, variant), { name: clean, marker }]);
}

/** Renames the preset at `index` (kept as typed: the editor trims on blur, so a half-typed name is not lost). */
export const renamePreset = (tags: TagSetValue, variant: string, index: number, name: string): TagSetValue =>
  withPresets(tags, variant, presetsOf(tags, variant).map((p, i) => (i === index ? { ...p, name } : p)));

export const recolorPreset = (tags: TagSetValue, variant: string, index: number, marker: Marker): TagSetValue =>
  withPresets(tags, variant, presetsOf(tags, variant).map((p, i) => (i === index ? { ...p, marker } : p)));

export const removePreset = (tags: TagSetValue, variant: string, index: number): TagSetValue =>
  withPresets(tags, variant, presetsOf(tags, variant).filter((_, i) => i !== index));

export const movePreset = (tags: TagSetValue, variant: string, from: number, to: number): TagSetValue => withPresets(tags, variant, move(presetsOf(tags, variant), from, to));

/** The names a variant has twice (case ignored): the editor marks them in place. */
export function duplicatePresetNames(list: readonly TagPreset[]): Set<number> {
  const seen = new Map<string, number>();
  const twins = new Set<number>();
  list.forEach((p, i) => {
    const key = cleanName(p.name).toLocaleLowerCase();
    if (!key) return;
    const first = seen.get(key);
    if (first === undefined) seen.set(key, i);
    else twins.add(first).add(i);
  });
  return twins;
}

/** The most tags per scope and kind: the contract's 1 to 200. */
export const clampMax = (value: number, ceiling = 200) => (Number.isFinite(value) ? Math.min(ceiling, Math.max(1, Math.round(value))) : 1);

export const toggleRole = (roles: readonly string[], role: string): string[] => (roles.includes(role) ? roles.filter((r) => r !== role) : [...roles, role]);

// --- statuses --------------------------------------------------------------------------------------------------------------

/** The smallest `<prefix>_<n>` key no one holds yet. */
export function freshKey(taken: readonly string[], prefix = "state"): string {
  let n = taken.length + 1;
  while (taken.includes(`${prefix}_${n}`)) n += 1;
  return `${prefix}_${n}`;
}

export const transitionOf = (set: StatusSet, from: string, to: string): StatusTransition | undefined => set.transitions.find((t) => t.from === from && t.to === to);
export const isFinal = (set: StatusSet, key: string) => Boolean(set.states.find((s) => s.key === key)?.final);

const withStates = (set: StatusSet, states: StatusState[], rest: Partial<StatusSet> = {}): StatusSet => ({ ...set, states, ...rest });

/** Adds a state at the end (its key is fresh, its tone neutral); refused past `limit` (the contract's 12). */
export function addState(set: StatusSet, label: Label, limit = 12): StatusSet {
  if (set.states.length >= limit) return set;
  return withStates(set, [...set.states, { key: freshKey(set.states.map((s) => s.key)), label: { ...label }, tone: "neutral" }]);
}

/** Removes a state with every move that touches it; the initial state falls back to the first state that is not final. */
export function removeState(set: StatusSet, key: string): StatusSet {
  const states = set.states.filter((s) => s.key !== key);
  const transitions = set.transitions.filter((t) => t.from !== key && t.to !== key);
  const initial = set.initial === key ? states.find((s) => !s.final)?.key : set.initial;
  return withStates(set, states, { transitions, initial });
}

export const setStateLabel = (set: StatusSet, key: string, lang: Lang, text: string): StatusSet =>
  withStates(set, set.states.map((s) => (s.key === key ? { ...s, label: { ...s.label, [lang]: text } } : s)));

export const setStateTone = (set: StatusSet, key: string, tone: StatusTone): StatusSet =>
  withStates(set, set.states.map((s) => (s.key === key ? { ...s, tone } : s)));

/** Moves a state in the set's order — the order of a status column. */
export const moveState = (set: StatusSet, from: number, to: number): StatusSet => withStates(set, move(set.states, from, to));

/** Makes a state final (its moves out are dropped: a final state has no way out) or not. Refused for the initial state: it is never final. */
export function setFinal(set: StatusSet, key: string, final: boolean): StatusSet {
  if (final && set.initial === key) return set;
  const states = set.states.map((s) => (s.key === key ? { ...s, final } : s));
  return withStates(set, states, final ? { transitions: set.transitions.filter((t) => t.from !== key) } : {});
}

/** The state of an entity nobody moved yet. Refused for a final state. */
export const setInitial = (set: StatusSet, key: string): StatusSet => (isFinal(set, key) || !set.states.some((s) => s.key === key) ? set : { ...set, initial: key });

const replaceTransition = (set: StatusSet, from: string, to: string, next: StatusTransition | null): StatusSet => {
  const kept = set.transitions.filter((t) => !(t.from === from && t.to === to));
  return { ...set, transitions: next ? [...kept, next] : kept };
};

/** The roles that may make `from → to`. No role removes the move. Refused out of a final state and onto itself. */
export function setTransitionRoles(set: StatusSet, from: string, to: string, roles: readonly string[]): StatusSet {
  if (from === to || isFinal(set, from)) return set;
  if (roles.length === 0) return replaceTransition(set, from, to, null);
  const current = transitionOf(set, from, to);
  return replaceTransition(set, from, to, { ...current, from, to, roles: [...roles] });
}

/** Asks for a second press on this move (off by default). */
export function setTransitionConfirm(set: StatusSet, from: string, to: string, confirm: boolean): StatusSet {
  const current = transitionOf(set, from, to);
  if (!current) return set;
  const { confirm: _old, ...rest } = current;
  return replaceTransition(set, from, to, confirm ? { ...rest, confirm: true } : rest);
}

/** The reasons a mover may pick for this move, as data; none removes the list (no reason is accepted). */
export function setTransitionReasons(set: StatusSet, from: string, to: string, reasons: StatusTransition["reasons"]): StatusSet {
  const current = transitionOf(set, from, to);
  if (!current) return set;
  const { reasons: _old, ...rest } = current;
  return replaceTransition(set, from, to, reasons && reasons.length > 0 ? { ...rest, reasons: [...reasons] } : rest);
}

/** Adds an empty reason to a move (the editor then asks for its two labels). */
export function addReason(set: StatusSet, from: string, to: string, label: Label): StatusSet {
  const current = transitionOf(set, from, to);
  if (!current) return set;
  const reasons = current.reasons ?? [];
  return setTransitionReasons(set, from, to, [...reasons, { key: freshKey(reasons.map((r) => r.key), "reason"), label: { ...label } }]);
}
