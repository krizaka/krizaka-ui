// The registry of @krizaka/ui (study §4.3): for every primitive, its source files, its npm dependencies, the other
// primitives it builds on and the documentation of its props (react-docgen-typescript). Read by `build-registry.mjs`
// (which writes `registry/<name>.json` + `registry/index.json`) and by `registry.test.mjs`.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";

import docgen from "react-docgen-typescript";

export const PKG = resolve(import.meta.dirname, "..");
const SRC = join(PKG, "src");

/** Not primitives: the brand layer (marks, motion), the React Native entry and the test helpers. */
export const EXCLUDED = new Set(["native", "marks", "motion", "test"]);
/** Peers every primitive needs: not listed as dependencies. */
const PEERS = new Set(["react", "react-dom"]);

const posix = (path) => path.split(sep).join("/");
const isSource = (file) => /\.tsx?$/.test(file) && !/\.(test|stories)\.tsx?$/.test(file);

/** The primitives: every folder of `src/` but the excluded ones, and `cn` (a single file, `src/cn.ts`). */
export function primitiveNames() {
  const folders = readdirSync(SRC).filter((name) => statSync(join(SRC, name)).isDirectory() && !EXCLUDED.has(name));
  return [...folders, "cn"].sort();
}

/** The entry file of a primitive: what `@krizaka/ui/<name>` exports. */
export const entryOf = (name) => join(SRC, name === "cn" ? "cn.ts" : join(name, "index.ts"));

/** The primitive a source file belongs to, or null for a shared file of `src/` (e.g. `floating.ts`). */
function ownerOf(file) {
  const [first, ...rest] = posix(relative(SRC, file)).split("/");
  if (rest.length > 0) return first;
  return first === "cn.ts" ? "cn" : null;
}

function resolveImport(from, specifier) {
  const base = resolve(dirname(from), specifier);
  for (const candidate of [`${base}.ts`, `${base}.tsx`, join(base, "index.ts"), join(base, "index.tsx")]) {
    if (existsSync(candidate)) return candidate;
  }
  throw new Error(`${posix(relative(PKG, from))}: cannot resolve "${specifier}"`);
}

const packageName = (specifier) => specifier.split("/").slice(0, specifier.startsWith("@") ? 2 : 1).join("/");

/** Files, npm dependencies and registry dependencies of a primitive, following its relative imports. */
function collectSources(name, versions) {
  const own = name === "cn" ? [entryOf("cn")] : readdirSync(join(SRC, name), { recursive: true }).map((f) => join(SRC, name, f)).filter(isSource);
  const files = new Set(own);
  const dependencies = new Set();
  const registryDependencies = new Set();
  const queue = [...own];
  while (queue.length > 0) {
    const file = queue.shift();
    const source = readFileSync(file, "utf8");
    for (const [, specifier] of source.matchAll(/(?:from|import)\s+"([^"]+)"/g)) {
      if (specifier.startsWith(".")) {
        const target = resolveImport(file, specifier);
        const owner = ownerOf(target);
        if (owner === name) continue;
        if (owner) registryDependencies.add(owner);
        else if (!files.has(target)) {
          files.add(target);
          queue.push(target);
        }
      } else {
        const pkg = packageName(specifier);
        if (PEERS.has(pkg)) continue;
        if (!versions[pkg]) throw new Error(`${posix(relative(PKG, file))}: "${pkg}" is not a dependency of @krizaka/ui`);
        dependencies.add(`${pkg}@${versions[pkg]}`);
      }
    }
  }
  return {
    files: [...files].sort().map((file) => ({ path: posix(relative(SRC, file)), content: readFileSync(file, "utf8") })),
    dependencies: [...dependencies].sort(),
    registryDependencies: [...registryDependencies].sort(),
  };
}

/** The first JSDoc of the entry: what the primitive is. */
function summaryOf(name) {
  const match = readFileSync(entryOf(name), "utf8").match(/\/\*\*([\s\S]*?)\*\//);
  if (!match) return "";
  return match[1]
    .split("\n")
    .map((line) => line.replace(/^\s*\*\s?/, "").trim())
    .filter(Boolean)
    .join(" ")
    .replace(/^@krizaka\/ui\/[\w-]+ — /, "");
}

/**
 * A prop is the primitive's own when it is declared in `src/` (inherited DOM and Radix props are not), or when it has
 * no declaration at all: the variants of `tailwind-variants` (`VariantProps`), whose JSDoc the props type redeclares.
 */
function isOwnProp(prop) {
  const declarations = prop.declarations ?? [];
  if (declarations.length === 0) return !prop.parent || !prop.parent.fileName.includes("node_modules");
  return declarations.some((d) => !d.fileName.includes("node_modules"));
}

/** A default as written: `@default "md"` and `size = "md"` both give `md`. */
const unquote = (value) => (value == null ? null : String(value).replace(/^(["'`])(.*)\1$/, "$2"));

/** The names a primitive exports as types only (`type CountdownUnits`): never components. */
const typeExports = (name) => new Set([...readFileSync(entryOf(name), "utf8").matchAll(/\btype\s+([A-Z]\w*)/g)].map((m) => m[1]));

/** The props of every component a primitive exports, with react-docgen-typescript, in one TypeScript program. */
export function collectProps(names) {
  const parser = docgen.withCustomConfig(join(PKG, "tsconfig.json"), {
    savePropValueAsString: true,
    shouldRemoveUndefinedFromOptional: true,
    propFilter: isOwnProp,
  });
  const byFile = new Map(names.map((name) => [entryOf(name), name]));
  const docs = parser.parse([...byFile.keys()]);
  const result = Object.fromEntries(names.map((name) => [name, []]));
  for (const doc of docs) {
    const name = byFile.get(doc.filePath) ?? byFile.get(resolve(PKG, doc.filePath));
    // A component starts with a capital (not `cn`, `useCountdown`…); `__object` is a compound namespace (`Card = { Root,
    // Media… }`), documented through its members; a Radix part re-exported as is (`Dialog.Root`) has nothing of its own.
    if (!name || !/^[A-Z]/.test(doc.displayName) || typeExports(name).has(doc.displayName)) continue;
    if (Object.keys(doc.props).length === 0 && !doc.description) continue;
    result[name].push({
      component: doc.displayName,
      description: doc.description,
      props: Object.values(doc.props)
        .sort((a, b) => Number(b.required) - Number(a.required) || a.name.localeCompare(b.name))
        .map((prop) => ({
          name: prop.name,
          type: prop.type.name,
          default: unquote(prop.defaultValue?.value),
          description: prop.description,
          required: prop.required,
        })),
    });
  }
  return result;
}

/** The whole registry: one item per primitive, in name order. */
export function collectRegistry() {
  const pkg = JSON.parse(readFileSync(join(PKG, "package.json"), "utf8"));
  const names = primitiveNames();
  const props = collectProps(names);
  return names.map((name) => {
    const demo = join(PKG, "registry", "demos", `${name}.tsx`);
    return {
      name,
      type: "primitive",
      description: summaryOf(name),
      ...collectSources(name, pkg.dependencies ?? {}),
      demo: existsSync(demo) ? { path: `demos/${name}.tsx`, content: readFileSync(demo, "utf8") } : null,
      props: props[name],
    };
  });
}
