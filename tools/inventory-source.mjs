// WHY  Reading the source of a product (which files, which top-level declarations, which imports, the product's door to the platform) is separate from judging it.
// WHAT `sourceFiles`, `definitions`, `importsOf`, `readDoor`, `doorSources` and the small regexes they use, each named.
// HOW  Imported by tools/inventory.mjs (which re-exports it); nothing to run. Tests: tools/inventory.test.mjs.
// OWNER krizaka-ui (lane platform), ADR-026 phase D.

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve, sep } from "node:path";

const SKIP_DIRS = new Set([
  "node_modules", ".next", "dist", "build", "out", "coverage", "storybook-static", ".turbo", ".expo", "android", "ios",
  "__screenshots__", "e2e", ".git", ".source", "test", "tests", "__tests__", "__mocks__",
]);
const SOURCE = /\.(tsx|ts|jsx|js|mjs)$/;
/** Drawings of a UI (a hero illustration, an isometric scene, a mock screen, the /story game): not UI to migrate. */
export const ILLUSTRATION = /(^|\/)(illustrations?|iso|showcase|story)\//;
const NOT_SOURCE = /\.(test|spec|stories|d)\.[cm]?[jt]sx?$|\.config\.[cm]?[jt]s$/;

/** Every source file under a folder, skipping builds, dependencies, tests and stories. */
export function sourceFiles(root, skip = []) {
  const out = [];
  const skipped = new Set([...SKIP_DIRS, ...skip]);
  const walk = (dir, depth) => {
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      if (e.name.startsWith(".") && e.isDirectory()) continue;
      if (e.isDirectory()) {
        if (!(depth === 0 ? skipped : SKIP_DIRS).has(e.name)) walk(join(dir, e.name), depth + 1);
      } else if (SOURCE.test(e.name) && !NOT_SOURCE.test(e.name)) {
        out.push(join(dir, e.name));
      }
    }
  };
  walk(root, 0);
  return out.sort((a, b) => a.localeCompare(b));
}

/** The start of a line, with the modifiers a top-level declaration may carry: `export`, `default`, `async`. */
const LINE_START = /^(?:export\s+)?(?:default\s+)?(?:async\s+)?/gm;
/** `function Name`: a function declaration, at the start of what follows the modifiers. */
const FUNCTION_DECLARATION = /^function\s+([A-Za-z_$][\w$]*)/;
/** `const Name: Type = value` or `let Name = value`: a variable, its name and the rest of its line (the value). */
const VARIABLE_DECLARATION = /^(?:const|let)\s+([A-Za-z_$][\w$]*)\s*(?::[^=\n]+)?=\s*([^\n]*)/;

/** The top-level declarations of a file as `[name, value of the first line | undefined]`, in order. */
function declarations(text) {
  const found = [];
  for (const start of text.matchAll(LINE_START)) {
    const rest = text.slice(start.index + start[0].length);
    const fn = FUNCTION_DECLARATION.exec(rest);
    if (fn) {
      found.push([fn[1], undefined]);
      continue;
    }
    const variable = VARIABLE_DECLARATION.exec(rest);
    if (variable) found.push([variable[1], variable[2]]);
  }
  return found;
}

/** The top-level definitions of a file: components (capitalised) and the few lower-case helpers the catalogue names. */
export function definitions(text) {
  const names = [];
  for (const [name, value] of declarations(text)) {
    // `const Tabs = createBottomTabNavigator()`: a library's factory, not a component written here.
    if (value !== undefined && FACTORY_CALL.test(value)) continue;
    if (COMPONENT_NAME.test(name) || name === "buttonClass" || name === "buttonVariants") names.push(name);
  }
  return [...new Set(names)];
}
/** `createStore(…)`: a call to a library's factory. */
const FACTORY_CALL = /^create[A-Z]\w*\(/;
/** A component: a name that starts with a capital. */
const COMPONENT_NAME = /^[A-Z]/;

/** The named items of an import or export clause (`{ A, B as C, type D }`): `[{ name, as }]`. */
function clauseItems(clause) {
  const start = clause.indexOf("{");
  if (start === -1) return [];
  const end = clause.indexOf("}", start + 1);
  if (end === -1) return [];
  return clause.slice(start + 1, end)
    .split(",")
    .map((item) => item.trim().replace(/^type\s+/, ""))
    .filter(Boolean)
    .map((item) => {
      const [name, as = name] = item.split(/\bas\b/).map((x) => x.trim());
      return { name, as };
    });
}

const IMPORTS = /\bimport\s([^;]*?)\bfrom\s*["']([^"']+)["']/g;
const EXPORTS_FROM = /export\s+(?:type\s+)?(\{[^}]*\})\s+from\s+["']([^"']+)["']/g;
const DOOR = /(^|\/)components\/ui\/index\.(tsx?|jsx?|mjs)$/;
const EXTENSIONS = ["", ".ts", ".tsx", ".js", ".jsx", ".mjs", "/index.ts", "/index.tsx", "/index.js"];

/** The imports of a file: `[{ spec, names: [{ name, as }] }]`. */
export function importsOf(text) {
  const found = [];
  for (const m of text.matchAll(IMPORTS)) {
    if (!/\s$/.test(m[1])) continue;
    const clause = m[1].trim().replace(/^type\s+(?=\S)/, "");
    if (clause) found.push({ spec: m[2], names: clauseItems(clause) });
  }
  return found;
}

/** A module specifier as a path without extension, when it is local (relative, `@/` or `~/`). */
function localPath(spec, file, root) {
  if (spec.startsWith(".")) return resolve(dirname(file), spec);
  if (spec.startsWith("@/") || spec.startsWith("~/")) return join(root, spec.slice(2));
  return undefined;
}

function readModule(path) {
  for (const ext of EXTENSIONS) {
    const p = path + ext;
    if (existsSync(p) && statSync(p).isFile()) return { path: p, text: readFileSync(p, "utf8") };
  }
  return undefined;
}

/**
 * The product's door to the platform (`components/ui/index.ts`): every name it exports and the package module it
 * comes from — directly (`export { Card } from "@krizaka/ui/card"`) or through one of its own files that imports it
 * (`export { Button } from "./Button"`, where `Button.tsx` imports `Button` from `@krizaka/ui/button`).
 * @returns {{ path: string, dir: string, names: Map<string, string> } | undefined}
 */
export function readDoor(files) {
  const index = files.find((f) => DOOR.test(f.split(sep).join("/")));
  if (!index) return undefined;
  const names = new Map();
  for (const m of readFileSync(index, "utf8").matchAll(EXPORTS_FROM)) {
    const spec = m[2];
    const local = spec.startsWith(".") ? readModule(resolve(dirname(index), spec)) : undefined;
    for (const { name, as } of clauseItems(m[1])) {
      if (!local) {
        names.set(as, spec);
        continue;
      }
      const from = importsOf(local.text).find((i) => !i.spec.startsWith(".") && i.names.some((n) => n.name === name));
      if (from) names.set(as, from.spec);
    }
  }
  return { path: index, dir: dirname(index), names };
}

/** The package modules a file reaches through the door: one per name it imports from it. */
export function doorSources(text, file, root, door) {
  if (!door) return [];
  const out = [];
  for (const { spec, names } of importsOf(text)) {
    const path = localPath(spec, file, root);
    if (path === undefined) continue;
    const target = [path, join(root, "src", spec.slice(2))].some((p) => p === door.dir || p === join(door.dir, "index") || p === door.path);
    if (!target) continue;
    for (const { name } of names) if (door.names.has(name)) out.push(door.names.get(name));
  }
  return out;
}

