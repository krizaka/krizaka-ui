// The surfaces a stream of A2UI messages builds — pure: `applyMessage` returns a new state, `readStream` turns a growing
// text (a model's answer as it arrives) into the messages it holds so far. Nothing here renders.
import { GENUI_LIMITS, type GenUiComponent, type GenUiMessage, type GenUiPropsCheck, parsePath, validateMessage } from "./spec";

/** One surface: its components by id, and its data model. */
export type GenUiSurfaceState = {
  readonly id: string;
  readonly components: ReadonlyMap<string, GenUiComponent>;
  readonly data: unknown;
};

/** Every surface of a stream, and what was refused on the way. */
export type GenUiState = {
  readonly surfaces: ReadonlyMap<string, GenUiSurfaceState>;
  /** The order surfaces were created in. */
  readonly order: readonly string[];
  /** Why messages were dropped, in order (a dropped message leaves the rest of the surface as it was). */
  readonly errors: readonly string[];
};

export const emptyGenUiState: GenUiState = { surfaces: new Map(), order: [], errors: [] };

const withError = (state: GenUiState, error: string): GenUiState => ({ ...state, errors: [...state.errors, error] });

function setAt(root: unknown, segments: readonly string[], value: unknown, remove: boolean): unknown {
  if (segments.length === 0) return remove ? Object.create(null) : value;
  const [head, ...rest] = segments;
  if (Array.isArray(root)) {
    const index = Number(head);
    if (!Number.isInteger(index) || index < 0 || index > root.length || index >= GENUI_LIMITS.array) return root;
    const copy = [...root];
    if (remove && rest.length === 0) copy.splice(index, 1);
    else copy[index] = setAt(root[index], rest, value, remove);
    return copy;
  }
  const base: Record<string, unknown> = Object.assign(Object.create(null), root !== null && typeof root === "object" ? root : {});
  if (remove && rest.length === 0) delete base[head];
  else base[head] = setAt(base[head], rest, value, remove);
  return base;
}

/** The value at a JSON pointer of the data model, `undefined` when there is none. */
export function readPath(data: unknown, path: string): unknown {
  const parsed = parsePath(path);
  if (!parsed.ok) return undefined;
  let cursor: unknown = data;
  for (const segment of parsed.value) {
    if (cursor === null || typeof cursor !== "object") return undefined;
    if (!Object.hasOwn(cursor, segment)) return undefined;
    cursor = (cursor as Record<string, unknown>)[segment];
  }
  return cursor;
}

/** The state after one validated message. */
export function applyMessage(state: GenUiState, message: GenUiMessage): GenUiState {
  if ("createSurface" in message) {
    const { surfaceId } = message.createSurface;
    if (state.surfaces.has(surfaceId)) return withError(state, `surface "${surfaceId}" already exists`);
    const surfaces = new Map(state.surfaces);
    surfaces.set(surfaceId, { id: surfaceId, components: new Map(), data: Object.create(null) });
    return { ...state, surfaces, order: [...state.order, surfaceId] };
  }
  if ("deleteSurface" in message) {
    const surfaces = new Map(state.surfaces);
    surfaces.delete(message.deleteSurface.surfaceId);
    return { ...state, surfaces, order: state.order.filter((id) => id !== message.deleteSurface.surfaceId) };
  }
  const surfaceId = "updateComponents" in message ? message.updateComponents.surfaceId : message.updateDataModel.surfaceId;
  const surface = state.surfaces.get(surfaceId);
  if (!surface) return withError(state, `surface "${surfaceId}" was not created`);
  const surfaces = new Map(state.surfaces);
  if ("updateComponents" in message) {
    const components = new Map(surface.components);
    for (const component of message.updateComponents.components) components.set(component.id, component);
    if (components.size > GENUI_LIMITS.components) return withError(state, `surface "${surfaceId}" holds more than ${GENUI_LIMITS.components} components`);
    surfaces.set(surfaceId, { ...surface, components });
  } else {
    const { path, value } = message.updateDataModel;
    const parsed = parsePath(path);
    if (!parsed.ok) return withError(state, parsed.error);
    surfaces.set(surfaceId, { ...surface, data: setAt(surface.data, parsed.value, value, !("value" in message.updateDataModel)) });
  }
  return { ...state, surfaces };
}

/** The first complete JSON object of a line when only stray `}` / `]` follow it, else null. Strings are skipped. */
export function leadingObject(text: string): string | null {
  if (!text.startsWith("{")) return null;
  let depth = 0;
  let inString = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inString) {
      if (c === "\\") i++;
      else if (c === '"') inString = false;
      continue;
    }
    if (c === '"') inString = true;
    else if (c === "{" || c === "[") depth++;
    else if (c === "}" || c === "]") {
      depth--;
      if (depth === 0) return /^[\s}\]]*$/.test(text.slice(i + 1)) ? text.slice(0, i + 1) : null;
    }
  }
  return null;
}

/** The state after a line of JSON (one message), the line refused with its reason when it is not valid. */
export function applyLine(state: GenUiState, line: string, catalog: Readonly<Record<string, { readonly check: GenUiPropsCheck }>>): GenUiState {
  const text = line.trim();
  if (!text) return state;
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    // Models sometimes close one brace too many: the first complete object is kept when what follows it is only
    // stray closing brackets. Anything else is not JSON and is refused. (The object is still validated as any other.)
    const head = leadingObject(text);
    if (head === null) return withError(state, "a line is not JSON");
    try {
      json = JSON.parse(head);
    } catch {
      return withError(state, "a line is not JSON");
    }
  }
  const result = validateMessage(json, catalog);
  return result.ok ? applyMessage(state, result.value) : withError(state, result.error);
}

/** Where a fenced `a2ui` block sits in a text: its JSON Lines so far, whether it is closed, and the prose around it. */
export type GenUiExtract = { readonly lines: readonly string[]; readonly closed: boolean; readonly prose: string; readonly found: boolean };

const FENCE = /```a2ui[^\n]*\n/;

/**
 * Splits a model's answer — complete or still arriving — into its prose and the complete lines of its `a2ui` fence.
 * A line still being written (no newline yet, the fence open) is left for the next call: the surface grows message by
 * message as the answer streams.
 */
export function extractGenUi(text: string): GenUiExtract {
  const open = FENCE.exec(text);
  if (!open) return { lines: [], closed: false, prose: text, found: false };
  const start = open.index + open[0].length;
  const end = text.indexOf("\n```", start - 1);
  const closed = end >= 0;
  const body = closed ? text.slice(start, end) : text.slice(start);
  const parts = body.split("\n");
  const lines = closed ? parts : parts.slice(0, -1);
  const after = closed ? text.slice(end + 4).replace(/^[^\n]*\n?/, "") : "";
  const prose = [text.slice(0, open.index).trim(), after.trim()].filter(Boolean).join("\n\n");
  return { lines: lines.filter((l) => l.trim()), closed, prose, found: true };
}

/** The state of every surface a model's answer describes so far. */
export function readStream(text: string, catalog: Readonly<Record<string, { readonly check: GenUiPropsCheck }>>): GenUiState & { readonly prose: string; readonly found: boolean } {
  const { lines, prose, found } = extractGenUi(text);
  const state = lines.reduce((s, line) => applyLine(s, line, catalog), emptyGenUiState);
  return { ...state, prose, found };
}
