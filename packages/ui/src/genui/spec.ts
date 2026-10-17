// The data-driven UI spec: a strict subset of A2UI v0.9 (ADR-082, krizaka/orazaka-packs). A model describes an interface
// as data — never code — and only with the components of a catalog the client declares. Everything here is a pure
// function over JSON: parse, validate, apply. Nothing is evaluated, nothing is trusted.

/** The protocol version every message carries. */
export const GENUI_VERSION = "v0.9";

/** The catalog a surface must name: the Krizaka components, version 1. */
export const GENUI_CATALOG_ID = "krizaka:genui/v1";

/** The bounds of a surface — what a model may ask for, at most. */
export const GENUI_LIMITS = {
  /** Components per surface. */
  components: 300,
  /** Nesting depth from the root. */
  depth: 12,
  /** Characters in one string. */
  string: 4000,
  /** Items in one array of the data model. */
  array: 1000,
  /** Nesting depth of a data model value. */
  dataDepth: 12,
  /** Values (objects, arrays, scalars) in one data model update. */
  dataNodes: 50_000,
  /** Segments of a data path. */
  pathSegments: 16,
} as const;

/** One component as the model writes it: an id, the catalog name, its properties. */
export type GenUiComponent = { readonly id: string; readonly component: string } & Readonly<Record<string, unknown>>;

/** A value bound to the data model: `{ "path": "/rows" }`. */
export type GenUiBinding = { readonly path: string };

/** The four messages of A2UI v0.9. */
export type GenUiMessage =
  | { readonly version: typeof GENUI_VERSION; readonly createSurface: { readonly surfaceId: string; readonly catalogId: string } }
  | { readonly version: typeof GENUI_VERSION; readonly updateComponents: { readonly surfaceId: string; readonly components: readonly GenUiComponent[] } }
  | { readonly version: typeof GENUI_VERSION; readonly updateDataModel: { readonly surfaceId: string; readonly path: string; readonly value?: unknown } }
  | { readonly version: typeof GENUI_VERSION; readonly deleteSurface: { readonly surfaceId: string } };

/** What validating a message says. */
export type GenUiResult<T> = { readonly ok: true; readonly value: T } | { readonly ok: false; readonly error: string };

/** How a catalog entry checks a component's own properties: `null` when they are fine, else why not. */
export type GenUiPropsCheck = (component: GenUiComponent) => string | null;

const ID = /^[A-Za-z0-9_-]{1,64}$/;
const MESSAGE_KEYS = ["createSurface", "updateComponents", "updateDataModel", "deleteSurface"] as const;
const FORBIDDEN_SEGMENTS = new Set(["__proto__", "prototype", "constructor"]);

const fail = (error: string): { ok: false; error: string } => ({ ok: false, error });

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function onlyKeys(value: Record<string, unknown>, allowed: readonly string[], where: string): string | null {
  for (const key of Object.keys(value)) if (!allowed.includes(key)) return `${where}: unknown key "${key}"`;
  return null;
}

/** An id of a surface or a component, or why not. */
export function checkId(value: unknown, where: string): string | null {
  return typeof value === "string" && ID.test(value) ? null : `${where}: an id is 1-64 characters of [A-Za-z0-9_-]`;
}

/** The segments of a JSON pointer (`/a/b/0`), or why it is refused — `__proto__` and friends never pass. */
export function parsePath(path: unknown): GenUiResult<readonly string[]> {
  if (typeof path !== "string" || (path !== "/" && !path.startsWith("/")) || path.length > 512) return fail("a path is a JSON pointer: /a/b");
  if (path === "/") return { ok: true, value: [] };
  const segments = path
    .slice(1)
    .split("/")
    .map((s) => s.replace(/~1/g, "/").replace(/~0/g, "~"));
  if (segments.length > GENUI_LIMITS.pathSegments) return fail(`a path has at most ${GENUI_LIMITS.pathSegments} segments`);
  for (const s of segments) {
    if (s === "" || FORBIDDEN_SEGMENTS.has(s)) return fail(`a path may not hold the segment "${s}"`);
  }
  return { ok: true, value: segments };
}

/** `true` when the value is a binding `{ path }` (and only that). */
export function isBinding(value: unknown): value is GenUiBinding {
  return isPlainObject(value) && Object.keys(value).length === 1 && typeof value.path === "string";
}

/**
 * A copy of a data model value that is plain JSON within the limits — strings, finite numbers, booleans, null, arrays
 * and plain objects — or why it is refused. The copy has a null prototype for every object: nothing it holds can
 * reach `Object.prototype`.
 */
export function sanitizeData(value: unknown): GenUiResult<unknown> {
  let nodes = 0;
  const walk = (v: unknown, depth: number): GenUiResult<unknown> => {
    if (++nodes > GENUI_LIMITS.dataNodes) return fail(`the data holds more than ${GENUI_LIMITS.dataNodes} values`);
    if (depth > GENUI_LIMITS.dataDepth) return fail(`the data nests deeper than ${GENUI_LIMITS.dataDepth}`);
    if (v === null || typeof v === "boolean") return { ok: true, value: v };
    if (typeof v === "number") return Number.isFinite(v) ? { ok: true, value: v } : fail("a number must be finite");
    if (typeof v === "string") return v.length <= GENUI_LIMITS.string ? { ok: true, value: v } : fail(`a string has at most ${GENUI_LIMITS.string} characters`);
    if (Array.isArray(v)) {
      if (v.length > GENUI_LIMITS.array) return fail(`an array has at most ${GENUI_LIMITS.array} items`);
      const out: unknown[] = [];
      for (const item of v) {
        const r = walk(item, depth + 1);
        if (!r.ok) return r;
        out.push(r.value);
      }
      return { ok: true, value: out };
    }
    if (isPlainObject(v)) {
      const out: Record<string, unknown> = Object.create(null);
      for (const [key, item] of Object.entries(v)) {
        if (FORBIDDEN_SEGMENTS.has(key)) return fail(`a key may not be "${key}"`);
        const r = walk(item, depth + 1);
        if (!r.ok) return r;
        out[key] = r.value;
      }
      return { ok: true, value: out };
    }
    return fail("the data is plain JSON only");
  };
  return walk(value, 0);
}

/**
 * A message as the model sent it — parsed and checked against the spec and the catalog, or why it is refused. A
 * component's own properties are checked by its catalog entry; a component the catalog does not hold is refused.
 */
export function validateMessage(input: unknown, catalog: Readonly<Record<string, { readonly check: GenUiPropsCheck }>>): GenUiResult<GenUiMessage> {
  if (!isPlainObject(input)) return fail("a message is a JSON object");
  if (input.version !== GENUI_VERSION) return fail(`version must be "${GENUI_VERSION}"`);
  const present = MESSAGE_KEYS.filter((k) => k in input);
  if (present.length !== 1) return fail("a message holds exactly one of createSurface, updateComponents, updateDataModel, deleteSurface");
  const kind = present[0];
  const extra = onlyKeys(input, ["version", kind], "message");
  if (extra) return fail(extra);
  const body = input[kind];
  if (!isPlainObject(body)) return fail(`${kind} is an object`);
  const surface = checkId(body.surfaceId, `${kind}.surfaceId`);
  if (surface) return fail(surface);

  switch (kind) {
    case "createSurface": {
      const keys = onlyKeys(body, ["surfaceId", "catalogId", "theme", "sendDataModel"], kind);
      if (keys) return fail(keys);
      if (body.catalogId !== GENUI_CATALOG_ID) return fail(`catalogId must be "${GENUI_CATALOG_ID}"`);
      return { ok: true, value: { version: GENUI_VERSION, createSurface: { surfaceId: body.surfaceId as string, catalogId: GENUI_CATALOG_ID } } };
    }
    case "updateComponents": {
      const keys = onlyKeys(body, ["surfaceId", "components"], kind);
      if (keys) return fail(keys);
      if (!Array.isArray(body.components) || body.components.length > GENUI_LIMITS.components) {
        return fail(`components is an array of at most ${GENUI_LIMITS.components}`);
      }
      const components: GenUiComponent[] = [];
      for (const raw of body.components) {
        if (!isPlainObject(raw)) return fail("a component is an object");
        const id = checkId(raw.id, "component.id");
        if (id) return fail(id);
        if (typeof raw.component !== "string" || !Object.hasOwn(catalog, raw.component)) {
          return fail(`component "${String(raw.id)}": "${String(raw.component)}" is not in the catalog`);
        }
        const clean = sanitizeData(raw);
        if (!clean.ok) return fail(`component "${raw.id}": ${clean.error}`);
        const component = { ...(clean.value as Record<string, unknown>) } as GenUiComponent;
        const problem = catalog[raw.component].check(component);
        if (problem) return fail(`component "${raw.id}" (${raw.component}): ${problem}`);
        components.push(component);
      }
      return { ok: true, value: { version: GENUI_VERSION, updateComponents: { surfaceId: body.surfaceId as string, components } } };
    }
    case "updateDataModel": {
      const keys = onlyKeys(body, ["surfaceId", "path", "value"], kind);
      if (keys) return fail(keys);
      const path = body.path === undefined ? "/" : body.path;
      const parsed = parsePath(path);
      if (!parsed.ok) return parsed;
      if (!("value" in body)) return { ok: true, value: { version: GENUI_VERSION, updateDataModel: { surfaceId: body.surfaceId as string, path: path as string } } };
      const clean = sanitizeData(body.value);
      if (!clean.ok) return clean;
      return { ok: true, value: { version: GENUI_VERSION, updateDataModel: { surfaceId: body.surfaceId as string, path: path as string, value: clean.value } } };
    }
    default: {
      const keys = onlyKeys(body, ["surfaceId"], kind);
      if (keys) return fail(keys);
      return { ok: true, value: { version: GENUI_VERSION, deleteSurface: { surfaceId: body.surfaceId as string } } };
    }
  }
}

// ── checks the catalog entries share ─────────────────────────────────────────────────────────────────────────────

/** Why the component's keys are refused, or null: only `id`, `component` and the entry's own keys. */
export function allowKeys(component: GenUiComponent, keys: readonly string[]): string | null {
  return onlyKeys(component, ["id", "component", ...keys], "properties");
}

/** A short text (or a binding to one), required or not. */
export function checkText(value: unknown, name: string, required: boolean): string | null {
  if (value === undefined) return required ? `${name} is required` : null;
  if (isBinding(value)) return parsePath(value.path).ok ? null : `${name}: a bad path`;
  return typeof value === "string" ? null : `${name} is a string`;
}

/** A value among a closed list. */
export function checkEnum(value: unknown, name: string, allowed: readonly string[], required = false): string | null {
  if (value === undefined) return required ? `${name} is required` : null;
  return typeof value === "string" && allowed.includes(value) ? null : `${name} is one of ${allowed.join(", ")}`;
}

/** A list of child ids. */
export function checkChildren(value: unknown, name = "children"): string | null {
  if (!Array.isArray(value) || value.length > GENUI_LIMITS.components) return `${name} is an array of component ids`;
  for (const id of value) if (checkId(id, name)) return `${name} holds ids only`;
  return null;
}

/** A binding to the data model (required). */
export function checkBinding(value: unknown, name: string): string | null {
  if (!isBinding(value)) return `${name} is a binding { "path": "/…" }`;
  return parsePath(value.path).ok ? null : `${name}: a bad path`;
}

/** A number, or a binding to one. */
export function checkNumber(value: unknown, name: string, required: boolean): string | null {
  if (value === undefined) return required ? `${name} is required` : null;
  if (isBinding(value)) return parsePath(value.path).ok ? null : `${name}: a bad path`;
  return typeof value === "number" && Number.isFinite(value) ? null : `${name} is a number`;
}

/** The value formats a model may name. */
export const GENUI_FORMATS = ["number", "integer", "compact", "percent", "money"] as const;
export type GenUiFormat = (typeof GENUI_FORMATS)[number];

/** A three-letter currency code. */
export function checkCurrency(value: unknown, required: boolean): string | null {
  if (value === undefined) return required ? "currency is required with the money format" : null;
  return typeof value === "string" && /^[A-Z]{3}$/.test(value) ? null : "currency is a three-letter code (CAD)";
}
