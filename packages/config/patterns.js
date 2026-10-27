// The four debts the UI refactor removes, as regex sources. One definition, read by the ESLint rules
// (eslint/krizaka-ui.js, on className literals) and by the ratchet (bin/krizaka-ratchet.mjs, on the source text).

/** Tailwind palette families a product never writes: a component reads a role (bg-surface-1, text-accent…). */
export const PALETTE_FAMILIES = Object.freeze([
  "zinc", "slate", "gray", "neutral", "stone",
  "fuchsia", "violet", "purple", "pink", "rose",
  "emerald", "green", "amber", "yellow", "red",
  "blue", "sky", "cyan", "indigo",
]);

/** Utilities that take a colour. */
export const COLOR_UTILITIES = Object.freeze(["bg", "text", "border", "from", "via", "to", "ring", "shadow", "fill", "stroke"]);

/**
 * `bg-zinc-900`, `text-violet-400/80`… — a raw palette step.
 * @param {readonly string[]} [allow] families allowed for documented, isolated cases (e.g. `["emerald"]`).
 * @returns {string} regex source
 */
export function paletteSource(allow = []) {
  const families = PALETTE_FAMILIES.filter((family) => !allow.includes(family));
  if (families.length === 0) return "(?!)"; // everything allowed: matches nothing
  return `\\b(${COLOR_UTILITIES.join("|")})-(${families.join("|")})-[0-9]`;
}

/** `light:bg-white` — a theme is a set of tokens, never a variant. */
export const LIGHT_VARIANT_SOURCE = "\\blight:";

/** `bg-[var(--surface-1)]` — the variable has a utility in @krizaka/tailwind. */
export const ARBITRARY_VAR_SOURCE = "\\[var\\(--";

/** `className={`…${x}`}` — the ratchet's text approximation of the TemplateLiteral rule. */
export const CLASSNAME_TEMPLATE_SOURCE = "className=\\{\\s*`";

// ── The stack debts (decisions S1–S3, S11 of the stack ADR) ──────────────────────────────────────────────────────
// Read by the ESLint rules (eslint/stack.js) and by the ratchet, like the UI patterns above.

/** A `"use client"` directive heading the file (after comments). */
export const USE_CLIENT_SOURCE = String.raw`^(?:\s|\/\/[^\n]*\n|\/\*[\s\S]*?\*\/)*["']use client["']`;

/** The opening of an effect call: `useEffect(`, `React.useLayoutEffect(`. */
export const EFFECT_CALL_SOURCE = String.raw`\buse(?:Layout)?Effect\s*\(`;

/** A fetch call: `fetch(`, `window.fetch(`, `krizakaFetch(` — never `refetch(`. */
export const FETCH_CALL_SOURCE = String.raw`\b(?:fetch|krizakaFetch)\s*\(`;

/** The names the ESLint rule matches (callee identifier or member property). */
export const EFFECT_NAMES_SOURCE = "^use(Layout)?Effect$";
export const FETCH_NAMES_SOURCE = "^(fetch|krizakaFetch)$";

// ── Effects are for the outside world (Oussama, 2026-10-27: « bug à adresser partout ») ─────────────────────────────
// Standard: krizaka/.github docs/standards/react-effects.md. Read by the rules `krizaka/no-async-in-effect` and
// `krizaka/no-derived-state-in-effect` (eslint/rules.js) and by the ratchet, through `effectProblem`.

/** What makes an effect load data: an await, `.then(`, `fetch(`, a Tauri `invoke(`, `api.x(`, `fooClient.x(`. */
export const ASYNC_EFFECT_SOURCE = String.raw`\bawait\b|\.then\s*\(|\b(?:fetch|krizakaFetch|invoke)\s*\(|\bapi\.\w+|\b\w*Client\.\w+\s*\(`;

/** A subscription to a system that pushes events: its callback may be async, the cleanup undoes it. */
export const SUBSCRIBE_EFFECT_SOURCE = String.raw`\b(?:listen|once|on|addEventListener|subscribe|addListener|new\s+(?:WebSocket|EventSource|ResizeObserver|IntersectionObserver|MutationObserver|BroadcastChannel)|\w+\.on)\s*\(`;

/**
 * Text with its strings, template literals and comments blanked (same length), so a keyword in a string is not read.
 * @param {string} source
 * @returns {string}
 */
export function blankStrings(source) {
  let out = "";
  for (let i = 0; i < source.length; i += 1) {
    const c = source[i];
    if (c === '"' || c === "'" || c === "`") {
      let j = i + 1;
      for (; j < source.length && source[j] !== c; j += 1) if (source[j] === "\\") j += 1;
      out += c + " ".repeat(Math.max(0, j - i - 1)) + c;
      i = j;
    } else if (c === "/" && source[i + 1] === "/") {
      const end = source.indexOf("\n", i);
      const stop = end < 0 ? source.length : end;
      out += " ".repeat(stop - i);
      i = stop - 1;
    } else if (c === "/" && source[i + 1] === "*") {
      const end = source.indexOf("*/", i + 2);
      const stop = end < 0 ? source.length : end + 2;
      out += source.slice(i, stop).replace(/[^\n]/g, " ");
      i = stop - 1;
    } else out += c;
  }
  return out;
}

/**
 * Removes every `setX(…)` call (balanced) from a blanked text.
 * @param {string} text
 * @returns {{ rest: string, found: number }}
 */
function withoutSetStateCalls(text) {
  let out = "";
  let found = 0;
  const re = /\bset[A-Z]\w*\s*\(/g;
  let last = 0;
  for (let m = re.exec(text); m; m = re.exec(text)) {
    const open = m.index + m[0].length - 1;
    const inner = balancedArguments(text, open);
    out += text.slice(last, m.index);
    last = open + inner.length + 2;
    re.lastIndex = last;
    found += 1;
  }
  return { rest: out + text.slice(last), found };
}

/**
 * What an effect body is wrong about: `"async"` (it loads data — use `useQuery` / `useMutation`) or `"derived"` (its
 * only statements are `setX(…)` calls — compute the value in render, or reset with a `key`), else null.
 * A subscribe-and-cleanup effect (a push source and a `return` that undoes it) is the legitimate use and is never wrong.
 * @param {string} body the text of the effect callback (with or without its braces)
 * @returns {"async" | "derived" | null}
 */
export function effectProblem(body) {
  // the ratchet passes the whole callback (`() => { … }`), the ESLint rule its body: strip the signature
  const text = blankStrings(body).replace(/^\s*(?:async\s+)?(?:function\s*\w*\s*\([^)]*\)|\([^)]*\)|\w+)\s*(?:=>)?/, (head) => (/=>|function/.test(head) ? "" : head));
  if (new RegExp(SUBSCRIBE_EFFECT_SOURCE).test(text) && /\breturn\b/.test(text)) return null;
  if (new RegExp(ASYNC_EFFECT_SOURCE).test(text)) return "async";
  const { rest, found } = withoutSetStateCalls(text);
  if (found === 0) return null;
  const leftover = rest.replace(/\b(?:if|else)\b/g, "").replace(/\([^()]*(?:\([^()]*\)[^()]*)*\)/g, "").replace(/[\s;{}]/g, "");
  return leftover === "" ? "derived" : null;
}

/** The headless engines that only enter through a `@krizaka/*` package. */
export const TANSTACK_SCOPE = "@tanstack/";

/**
 * An import of one of the given packages (or scopes ending in `/`): `from "x"`, `import "x"`, `import("x")`,
 * `require("x")`, `export … from "x"`.
 * @param {readonly string[]} specifiers package names (`framer-motion`) or scope prefixes (`@tanstack/`)
 * @returns {string} regex source
 */
export function importSource(specifiers) {
  if (specifiers.length === 0) return "(?!)"; // nothing listed: matches nothing
  const escape = (/** @type {string} */ s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const names = specifiers.map((s) => (s.endsWith("/") ? `${escape(s)}[^"']+` : `${escape(s)}(?:/[^"']*)?`));
  return String.raw`(?:\bfrom|\bimport|\brequire)\s*(?:\(\s*)?["'](?:${names.join("|")})["']`;
}

/** A `<table` or `<form` element written in an app (JSX or HTML). */
export const TABLE_OR_FORM_SOURCE = String.raw`<(table|form)(?=[\s>/])`;

/** The elements that hold a value in a form: native fields and the field primitives of `@krizaka/ui`. */
export const FORM_FIELD_TAGS = Object.freeze([
  "input", "textarea", "select",
  "Input", "Textarea", "Select", "Combobox", "DatePicker", "DateRangePicker", "TagInput", "Checkbox", "Switch",
  "RadioGroup", "Slider", "SearchField", "Dropzone", "FileUpload", "OtpInput",
]);

/** `<input type="hidden|submit|button|reset|image">` holds no value the user types. */
const NOT_A_FIELD = /\btype=(?:\{\s?)?["'](?:hidden|submit|button|reset|image)["']/;

/**
 * The value-holding fields inside a form's source text.
 * @param {string} text
 * @returns {number}
 */
export function countFormFields(text) {
  const tags = new RegExp(String.raw`<(${FORM_FIELD_TAGS.join("|")})(?=[\s/>])([^>]*)`, "g");
  let fields = 0;
  for (const [, tag, attributes] of text.matchAll(tags)) {
    if (tag === "input" && NOT_A_FIELD.test(attributes ?? "")) continue;
    fields += 1;
  }
  return fields;
}

/**
 * The text between the parenthesis that opens at `open` and the one that closes it, skipping strings and comments.
 * @param {string} source
 * @param {number} open index of the `(`
 * @returns {string}
 */
export function balancedArguments(source, open) {
  let depth = 0;
  for (let i = open; i < source.length; i += 1) {
    const c = source[i];
    if (c === '"' || c === "'" || c === "`") {
      for (i += 1; i < source.length && source[i] !== c; i += 1) if (source[i] === "\\") i += 1;
    } else if (c === "/" && source[i + 1] === "/") {
      i = source.indexOf("\n", i);
      if (i < 0) break;
    } else if (c === "/" && source[i + 1] === "*") {
      i = source.indexOf("*/", i + 2) + 1;
      if (i <= 0) break;
    } else if (c === "(") depth += 1;
    else if (c === ")" && --depth === 0) return source.slice(open + 1, i);
  }
  return source.slice(open + 1);
}

// ── Selections live in the URL (Oussama, 2026-10-22: « changer les tabs doit changer les routes ») ──────────────────────
// Read by the ESLint rule krizaka/route-state-selection and by the ratchet.

/** The selection components whose choice belongs in the URL: tabs, a segmented switch, toggle groups, chip groups, choice tiles. */
export const SELECTION_COMPONENTS = Object.freeze(["Tabs.Root", "TabsRoot", "Chip.Group", "ChipGroup", "ChoiceGrid", "SegmentedControl", "ToggleGroup", "ToggleGroup.Root", "RadioGroup.Root"]);

/** The props that make a selection local: its own value, its starting value, its change handler. */
export const LOCAL_SELECTION_PROPS = Object.freeze(["value", "defaultValue", "onValueChange"]);

/** The prop that binds it to the URL. */
export const ROUTE_KEY_PROP = "routeKey";

/** The justification that keeps a local selection: `// @ephemeral: a hover card's tab` on the line or the line above. */
export const EPHEMERAL_SOURCE = String.raw`@ephemeral:\s*\S`;


/** The opening tags (`<Tabs.Root … >`) of the selection components in a source text, each with the line above it. */
export function selectionTags(/** @type {string} */ source) {
  /** @type {{ tag: string, before: string }[]} */
  const found = [];
  const names = SELECTION_COMPONENTS.map((n) => n.replace(".", "\\.")).join("|");
  for (const open of source.matchAll(new RegExp(`<(?:${names})(?![\\w.])`, "g"))) {
    let depth = 0;
    let end = open.index;
    for (; end < source.length; end += 1) {
      const c = source[end];
      if (c === "{") depth += 1;
      else if (c === "}") depth -= 1;
      else if (c === ">" && depth === 0) break;
    }
    const lineStart = source.lastIndexOf("\n", open.index - 1);
    const before = lineStart < 0 ? "" : source.slice(source.lastIndexOf("\n", lineStart - 1) + 1, lineStart);
    found.push({ tag: source.slice(open.index, end + 1), before });
  }
  return found;
}

/**
 * Is this opening tag a selection driven by local state? `tag` is its source (`<Tabs.Root value={x} onValueChange={set}>`),
 * `before` the text of the line above it.
 * @param {string} tag
 * @param {string} [before]
 */
export function isLocalSelection(tag, before = "") {
  const name = /^<([A-Za-z][\w.]*)/.exec(tag)?.[1];
  if (!name || !SELECTION_COMPONENTS.includes(name)) return false;
  // A radio group is a form field unless it is drawn as a segmented switch (`variant="segmented"`): that one is a view's selection.
  if (name === "RadioGroup.Root" && !/\bvariant\s*=\s*["']segmented["']/.test(tag)) return false;
  const hasProp = (/** @type {string} */ prop) => new RegExp(`\\b${prop}\\s*(=|\\{|\\s|/?>)`).test(tag);
  if (hasProp(ROUTE_KEY_PROP)) return false;
  if (new RegExp(EPHEMERAL_SOURCE).test(tag) || new RegExp(EPHEMERAL_SOURCE).test(before)) return false;
  return LOCAL_SELECTION_PROPS.some((prop) => new RegExp(`\\b${prop}\\s*=`).test(tag));
}

// ── Every page declares its template (Oussama, 2026-10-22: sessions hand-built pages instead of composing Krizaka UI) ──────
// Read by the ESLint rule krizaka/page-template and by the ratchet.

/** The page templates of @krizaka/ui (ui.krizaka.com/templates): the site's, then the app's; `redirect` is an address kept for old links. */
export const PAGE_TEMPLATES = Object.freeze([
  "landing",
  "product",
  "how-it-works",
  "gallery",
  "docs-hub",
  "docs-article",
  "component",
  "catalogue",
  "longform",
  "changelog",
  "contact",
  "legal",
  "status",
  "error",
  "pricing",
  "app-dashboard",
  "app-list-detail",
  "app-settings",
  "app-onboarding",
  "app-empty-first-run",
  "app-wizard",
  "redirect",
]);

/** The template that is not one: a page that really composes none, with its reason (the declaration `template: custom: a canvas editor`). */
export const CUSTOM_TEMPLATE = "custom";

/** A page of the Next.js App Router: `app/**\/page.tsx` (or `src/app/…`). */
export const PAGE_FILE_SOURCE = String.raw`(?:^|[\\/])app[\\/](?:.*[\\/])?page\.[cm]?[jt]sx?$`;

/** The declaration, alone on its line, as a line comment or a block comment (the rule's message shows its form). */
// The reason never starts with the block comment's `*/`: `/* @template: custom: */` declares no reason.
export const TEMPLATE_TAG_SOURCE = String.raw`^[ \t]*(?://|/\*+)[ \t]*@template:[ \t]*([a-z][a-z-]*)(?:[ \t]*:[ \t]*((?!\*\/)\S[^\n]*?)?)?[ \t]*(?:\*/)?[ \t]*$`;

/**
 * What is wrong with a page's template declaration, or `null` when it is fine.
 * @param {string} source
 * @returns {{ kind: "missing" } | { kind: "unknown", name: string } | { kind: "reason" } | null}
 */
export function pageTemplateProblem(source) {
  const tag = new RegExp(TEMPLATE_TAG_SOURCE, "m").exec(source);
  if (!tag) return { kind: "missing" };
  const [, name, reason] = tag;
  if (name === CUSTOM_TEMPLATE) return reason ? null : { kind: "reason" };
  return PAGE_TEMPLATES.includes(name) ? null : { kind: "unknown", name };
}

/**
 * True for the file of a route's page.
 * @param {string} filename
 */
export function isPageFile(filename) {
  return new RegExp(PAGE_FILE_SOURCE).test(filename);
}
