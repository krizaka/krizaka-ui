// The registry of @krizaka/ui (study §4.3): for every component, its documentation — carried by the code: the
// `meta.ts` beside it (src/meta.ts), its named examples (registry/examples), the props of its web and native
// components (react-docgen-typescript) — and, for a web primitive, its source files, its npm dependencies and the
// other primitives it builds on. Read by `build-registry.mjs` (which writes `registry/<name>.json` +
// `registry/index.json`, rendered by krizaka.com/docs/ui) and by `registry.test.mjs`.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";

import docgen from "react-docgen-typescript";

export const PKG = resolve(import.meta.dirname, "..");
const SRC = join(PKG, "src");
const NATIVE = join(SRC, "native");
export const EXAMPLES = join(PKG, "registry", "examples");

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

/** The components that exist only in React Native: `src/native/meta/<name>.ts`. */
export function nativeOnlyNames() {
  const dir = join(NATIVE, "meta");
  return existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".ts")).map((f) => f.replace(/\.ts$/, "")).sort() : [];
}

/** Every documented component, web primitives and native-only ones, in name order. */
export const componentNames = () => [...primitiveNames(), ...nativeOnlyNames()].sort();

/** The `meta.ts` of a component (src/meta.ts): a web primitive's beside its source, a native-only one's in src/native/meta. */
export const metaFileOf = (name) =>
  primitiveNames().includes(name) ? join(SRC, name === "cn" ? "cn.meta.ts" : join(name, "meta.ts")) : join(NATIVE, "meta", `${name}.ts`);

/** Reads a component's documentation: plain data in erasable TypeScript, imported by Node (type stripping). */
export async function readMeta(name) {
  const file = metaFileOf(name);
  if (!existsSync(file)) return null;
  const { meta } = await import(pathToFileURL(file).href);
  return meta ?? null;
}

/** The file of an example: `registry/examples/<name>/<example>.tsx`, `…/native/<example>.tsx` for React Native. */
export const exampleFileOf = (name, platform, example) => join(EXAMPLES, name, ...(platform === "native" ? ["native"] : []), `${example}.tsx`);

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
  return parseProps(new Map(names.map((name) => [entryOf(name), name])), (name) => typeExports(name));
}

/** The source of a native component: `src/native/<name>.tsx` (the web name: `button`, `empty-state`, `segmented`). */
export const nativeFileOf = (name) => join(NATIVE, `${name}.tsx`);

/** The props of the native components (`src/native/<name>.tsx`) of the given components. */
export function collectNativeProps(names) {
  const files = new Map(names.filter((name) => existsSync(nativeFileOf(name))).map((name) => [nativeFileOf(name), name]));
  const result = parseProps(files, () => new Set());
  return Object.fromEntries(names.map((name) => [name, result[name] ?? []]));
}

function parseProps(byFile, typeOnly) {
  const parser = docgen.withCustomConfig(join(PKG, "tsconfig.json"), {
    savePropValueAsString: true,
    shouldRemoveUndefinedFromOptional: true,
    propFilter: isOwnProp,
  });
  const docs = parser.parse([...byFile.keys()]);
  const result = Object.fromEntries([...byFile.values()].map((name) => [name, []]));
  for (const doc of docs) {
    const name = byFile.get(doc.filePath) ?? byFile.get(resolve(PKG, doc.filePath));
    // A component starts with a capital (not `cn`, `useCountdown`…); `__object` is a compound namespace (`Card = { Root,
    // Media… }`), documented through its members; a Radix part re-exported as is (`Dialog.Root`) has nothing of its own.
    if (!name || !/^[A-Z]/.test(doc.displayName) || typeOnly(name).has(doc.displayName)) continue;
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

/** The Linux screenshots of the stories (apps/storybook, compared in CI): what a native example looks like. */
export const SCREENSHOTS = resolve(PKG, "..", "..", "apps", "storybook", "__screenshots__", "linux");

/** The story of a native example (`Native/EmptyState` › `IconOnly` → `native-emptystate--icon-only`) and its screenshots. */
export function nativeScreenshotsOf(name, example) {
  const id = `native-${name.replace(/-/g, "")}--${example}`;
  const files = { dark: join(SCREENSHOTS, `${id}--dark.png`), light: join(SCREENSHOTS, `${id}--light.png`) };
  return existsSync(files.dark) && existsSync(files.light) ? files : null;
}

/** A platform's examples, with the code a reader copies (and, for React Native, its screenshots in both themes). */
function examplesOf(name, platform, list) {
  return (list ?? []).map((example) => {
    const file = exampleFileOf(name, platform, example.name);
    const path = posix(relative(join(PKG, "registry"), file));
    const base = path.replace(/\.tsx$/, "");
    const shots = platform === "native" ? nativeScreenshotsOf(name, example.name) : null;
    return {
      ...example,
      path,
      // What a product imports to render it live: `@krizaka/ui/registry/examples/button/primary`.
      module: `@krizaka/ui/registry/${base}`,
      code: existsSync(file) ? readFileSync(file, "utf8") : "",
      // React Native has no live preview on the web: the story's screenshots, copied beside the example by the build.
      ...(shots ? { screenshots: { dark: `${base}.dark.png`, light: `${base}.light.png` } } : {}),
    };
  });
}

const importLine = (names, from) => `import { ${[...names].join(", ")} } from "${from}";`;

/** The whole registry: one item per component (web primitives and native-only ones), in name order. */
export async function collectRegistry() {
  const pkg = JSON.parse(readFileSync(join(PKG, "package.json"), "utf8"));
  const primitives = primitiveNames();
  const names = componentNames();
  const props = collectProps(primitives);
  const nativeProps = collectNativeProps(names);
  const items = [];
  for (const name of names) {
    const meta = await readMeta(name);
    const web = primitives.includes(name);
    const webExamples = examplesOf(name, "web", meta?.web?.examples);
    const nativeExamples = examplesOf(name, "native", meta?.native?.examples);
    const doc = {
      name,
      type: web ? "primitive" : "native",
      title: meta?.title ?? name,
      summary: meta?.summary ?? "",
      // `description`: the summary, under the name the first registry used.
      description: meta?.summary ?? (web ? summaryOf(name) : ""),
      status: meta?.status ?? "beta",
      category: meta?.category ?? "foundations",
      platforms: meta?.platforms ?? (web ? "web" : "native"),
      whenToUse: meta?.whenToUse ?? [],
      whenNotToUse: meta?.whenNotToUse ?? [],
      bestPractices: meta?.bestPractices ?? [],
      accessibility: meta?.accessibility ?? { keyboard: [], notes: [] },
      related: meta?.related ?? [],
      web: meta?.web
        ? { entry: `@krizaka/ui/${name}`, import: importLine(meta.web.imports, `@krizaka/ui/${name}`), props: props[name] ?? [], examples: webExamples }
        : null,
      native: meta?.native
        ? {
            entry: "@krizaka/ui/native",
            import: importLine(meta.native.imports, "@krizaka/ui/native"),
            differences: meta.native.differences,
            props: nativeProps[name] ?? [],
            examples: nativeExamples,
          }
        : null,
    };
    if (!web) {
      items.push({ ...doc, files: [], dependencies: [], registryDependencies: [], demo: null, props: [] });
      continue;
    }
    const first = webExamples[0];
    items.push({
      ...doc,
      ...collectSources(name, pkg.dependencies ?? {}),
      // The preview: the first web example (what `demo` was before the examples).
      demo: first ? { path: first.path, content: first.code } : null,
      props: props[name],
    });
  }
  return items;
}
