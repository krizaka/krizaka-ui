// The registry of @krizaka/charts — the same shape as @krizaka/ui's (packages/ui/scripts/registry.mjs), so
// krizaka.com/docs/ui renders both with one template: for every documented component, its documentation carried by
// the code (`src/meta/<name>.ts`), its named examples (registry/examples) and the props of its web and native
// components (react-docgen-typescript). Read by `build-registry.mjs` and `registry.test.mjs`.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";

import docgen from "react-docgen-typescript";

export const PKG = resolve(import.meta.dirname, "..");
export const PACKAGE = "@krizaka/charts";
const SRC = join(PKG, "src");
const META = join(SRC, "meta");
export const EXAMPLES = join(PKG, "registry", "examples");
export const REPO_PATH = "packages/charts";

const posix = (path) => path.split(sep).join("/");

/** Every documented component: one `src/meta/<name>.ts` each. */
export const componentNames = () =>
  readdirSync(META)
    .filter((f) => f.endsWith(".ts") && f !== "types.ts")
    .map((f) => f.replace(/\.ts$/, ""))
    .sort();

export const metaFileOf = (name) => join(META, `${name}.ts`);

export async function readMeta(name) {
  const file = metaFileOf(name);
  if (!existsSync(file)) return null;
  const { meta } = await import(pathToFileURL(file).href);
  return meta ?? null;
}

export const exampleFileOf = (name, platform, example) => join(EXAMPLES, name, ...(platform === "native" ? ["native"] : []), `${example}.tsx`);
export const entryFileOf = (entry) => join(SRC, entry, "index.ts");
export const NATIVE_ENTRY = join(SRC, "native", "index.ts");

const isOwnProp = (prop) => {
  const declarations = prop.declarations ?? [];
  if (declarations.length === 0) return !prop.parent || !prop.parent.fileName.includes("node_modules");
  return declarations.some((d) => !d.fileName.includes("node_modules"));
};
const unquote = (value) => (value == null ? null : String(value).replace(/^(["'`])(.*)\1$/, "$2"));

/** The props of the named components exported by the given files, in one TypeScript program. */
export function collectProps(files) {
  const parser = docgen.withCustomConfig(join(PKG, "tsconfig.json"), { savePropValueAsString: true, shouldRemoveUndefinedFromOptional: true, propFilter: isOwnProp });
  const byName = new Map();
  for (const doc of parser.parse(files)) {
    if (!/^[A-Z]/.test(doc.displayName)) continue;
    byName.set(doc.displayName, {
      component: doc.displayName,
      description: doc.description,
      props: Object.values(doc.props)
        .sort((a, b) => Number(b.required) - Number(a.required) || a.name.localeCompare(b.name))
        .map((prop) => ({ name: prop.name, type: prop.type.name, default: unquote(prop.defaultValue?.value), description: prop.description, required: prop.required })),
    });
  }
  return byName;
}

/** The Linux screenshots of the stories (apps/storybook, compared in CI): what a native example looks like. */
export const SCREENSHOTS = resolve(PKG, "..", "..", "apps", "storybook", "__screenshots__", "linux");

/** The story of a native example (`Charts Native/LineChart` › `CreatorEarnings`) and its screenshots. */
export function nativeScreenshotsOf(name, example) {
  const id = `charts-native-${name.replace(/-/g, "")}--${example}`;
  const files = { dark: join(SCREENSHOTS, `${id}--dark.png`), light: join(SCREENSHOTS, `${id}--light.png`) };
  return existsSync(files.dark) && existsSync(files.light) ? files : null;
}

function examplesOf(name, platform, list) {
  return (list ?? []).map((example) => {
    const file = exampleFileOf(name, platform, example.name);
    const path = posix(relative(join(PKG, "registry"), file));
    const base = path.replace(/\.tsx$/, "");
    const shots = platform === "native" ? nativeScreenshotsOf(name, example.name) : null;
    return {
      ...example,
      path,
      module: `${PACKAGE}/registry/${base}`,
      code: existsSync(file) ? readFileSync(file, "utf8") : "",
      ...(shots ? { screenshots: { dark: `${base}.dark.png`, light: `${base}.light.png` } } : {}),
    };
  });
}

const importLine = (names, from) => `import { ${[...names].join(", ")} } from "${from}";`;

/** The whole registry: one item per documented component, in name order. */
export async function collectRegistry() {
  const pkg = JSON.parse(readFileSync(join(PKG, "package.json"), "utf8"));
  const names = componentNames();
  const metas = Object.fromEntries(await Promise.all(names.map(async (name) => [name, await readMeta(name)])));
  const entries = [...new Set(names.map((n) => metas[n]?.web?.entry).filter(Boolean))];
  const webProps = collectProps(entries.map(entryFileOf));
  const nativeProps = collectProps([NATIVE_ENTRY]);
  const dependencies = Object.entries(pkg.dependencies ?? {}).map(([dep, range]) => `${dep}@${range}`);
  return names.map((name) => {
    const meta = metas[name] ?? {};
    const webExamples = examplesOf(name, "web", meta.web?.examples);
    const first = webExamples[0];
    return {
      name,
      package: PACKAGE,
      type: "chart",
      title: meta.title ?? name,
      summary: meta.summary ?? "",
      description: meta.summary ?? "",
      status: meta.status ?? "beta",
      category: meta.category ?? "charts",
      platforms: meta.platforms ?? "web",
      engine: meta.engine ?? null,
      tier: meta.tier ?? "core",
      whenToUse: meta.whenToUse ?? [],
      whenNotToUse: meta.whenNotToUse ?? [],
      bestPractices: meta.bestPractices ?? [],
      accessibility: meta.accessibility ?? { keyboard: [], notes: [] },
      related: meta.related ?? [],
      // Where the page's words are written, and how a product installs it: for the site's page template.
      source: `${REPO_PATH}/src/meta/${name}.ts`,
      install: { web: `npm install ${PACKAGE}`, native: `npx expo install react-native-svg\nnpm install ${PACKAGE}` },
      web: meta.web
        ? {
            entry: `${PACKAGE}/${meta.web.entry}`,
            import: importLine(meta.web.imports, `${PACKAGE}/${meta.web.entry}`),
            props: meta.web.imports.map((c) => webProps.get(c)).filter(Boolean),
            examples: webExamples,
          }
        : null,
      native: meta.native
        ? {
            entry: `${PACKAGE}/native`,
            import: importLine(meta.native.imports, `${PACKAGE}/native`),
            differences: meta.native.differences,
            props: meta.native.imports.map((c) => nativeProps.get(c)).filter(Boolean),
            examples: examplesOf(name, "native", meta.native.examples),
          }
        : null,
      files: [],
      dependencies,
      registryDependencies: [],
      demo: first ? { path: first.path, content: first.code } : null,
      props: meta.web ? meta.web.imports.map((c) => webProps.get(c)).filter(Boolean) : [],
    };
  });
}
