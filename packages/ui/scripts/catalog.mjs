// The catalogue of @krizaka/ui in the krizaka-catalog/v1 shape (@krizaka/config/catalog/schema.json, krizaka-internal#3947):
// one entry per name a product imports — the names each meta.ts lists, and every name an example imports from a
// @krizaka/ui entry (`buttonVariants`, the `/server` halves) — with its import line, its props, the examples that use it
// and its rules. Built from the registry items (registry.mjs), the one source of ui.krizaka.com: `build-catalog.mjs`
// writes it to `catalog.json` (published, `@krizaka/ui/catalog.json`), read by the krizaka-docs MCP and the site.

export const CATALOG_SCHEMA = "krizaka-catalog/v1";

/** The text between the first `{` and the next `}` of a statement, or null. */
function braced(text) {
  const open = text.indexOf("{");
  const close = text.indexOf("}", open);
  return open < 0 || close < 0 ? null : { inside: text.slice(open + 1, close), before: text.slice(0, open), after: text.slice(close + 1) };
}

/** The `import { … } from "@krizaka/ui…"` statements of a code sample: `[module, name, typeOnly]`. */
export function importsOf(code) {
  const found = [];
  // The examples are formatted (Prettier): a statement starts a line, one space between its words.
  for (const statement of code.split(/^import /m).slice(1)) {
    const parts = braced(statement);
    const from = parts?.after.trimStart() ?? "";
    if (!parts || !from.startsWith('from "@krizaka/ui')) continue;
    const module = from.slice(6, from.indexOf('"', 6));
    if (module.startsWith("@krizaka/ui/registry")) continue;
    const typeAll = parts.before.trim() === "type";
    for (const raw of parts.inside.split(",")) {
      const part = raw.trim();
      if (!part) continue;
      const typeOnly = typeAll || part.startsWith("type ");
      found.push([module, part.replace(/^type /, "").split(" as ")[0].trim(), typeOnly]);
    }
  }
  return found;
}

/** What a name is, from its spelling and how it is imported. */
export function kindOf(name, typeOnly) {
  if (typeOnly) return "type";
  if (/^use[A-Z]/.test(name)) return "hook";
  if (/^[A-Z][A-Z0-9_]+$/.test(name)) return "constant";
  if (/^[A-Z]/.test(name)) return "component";
  return "function";
}

/** A documented export's kind: a lower-case `const` is a constant (`textLinkClass`), the rest as `kindOf` says. */
function declaredKindOf(name, declaration, typeOnly) {
  if (CONST_DECLARATIONS.has(declaration) && /^[a-z]/.test(name) && !/^use[A-Z]/.test(name)) return "constant";
  return kindOf(name, typeOnly);
}

const TYPE_DECLARATIONS = new Set(["type", "interface"]);
const CONST_DECLARATIONS = new Set(["const"]);
const STATUSES = new Set(["experimental", "beta", "stable", "deprecated"]);
const plain = (text) => text.replaceAll("`", "");

function rulesOf(item) {
  return {
    do: [...item.whenToUse, ...item.bestPractices].map(plain),
    dont: item.whenNotToUse.map((rule) => (rule.use ? { when: plain(rule.when), use: rule.use } : { when: plain(rule.when) })),
  };
}

function propsOf(side, name) {
  const component = side.props?.find((entry) => entry.component === name);
  return (component?.props ?? []).map((prop) => ({
    name: prop.name,
    type: prop.type,
    required: Boolean(prop.required),
    ...(prop.default == null ? {} : { default: String(prop.default) }),
    ...(prop.description ? { description: prop.description } : {}),
  }));
}

const exampleOf = (example) => ({ name: example.name, title: example.title, description: plain(example.description), language: "tsx", code: example.code.trimEnd() });

/** The platforms an item has, with their side (`web`, `native`). */
const sidesOf = (item) => ["web", "native"].filter((platform) => item[platform]).map((platform) => [platform, item[platform]]);

/** The names of an import line, in its order: the first is the component the item is named after. */
const namesOf = (line) => (braced(line)?.inside ?? "").split(",").map((name) => name.trim()).filter(Boolean);

/** Every example of the registry with the `[module, name]` pairs it imports. */
const examplesWithImports = (items) =>
  items.flatMap((item) => ["web", "native"].flatMap((platform) => (item[platform]?.examples ?? []).map((example) => ({ item, platform, example, imports: importsOf(example.code) }))));

/**
 * The catalogue document of @krizaka/ui.
 * @param {object[]} items the registry items (`collectRegistry()`).
 * @param {{ name: string, version: string, description?: string, homepage?: string }} pkg the package.json.
 * @param {Record<string, string>} [sources] the source of the entries no meta and no example covers, by module.
 */
export function catalogOf(items, pkg, sources = {}) {
  const samples = examplesWithImports(items);
  const entries = new Map();
  const add = (item, platform, module, name, typeOnly, primary = false) => {
    const key = `${module} ${name}`;
    if (entries.has(key)) return;
    const side = item[platform];
    const using = samples.filter((sample) => sample.imports.some(([m, n]) => m === module && n === name)).map((sample) => exampleOf(sample.example));
    const own = (side?.examples ?? []).map(exampleOf);
    const props = side ? propsOf(side, name) : [];
    entries.set(key, {
      name,
      kind: kindOf(name, typeOnly),
      module,
      import: `import ${typeOnly ? "type " : ""}{ ${name} } from "${module}";`,
      title: item.title,
      summary: plain(primary ? item.summary : `${name}, part of ${item.title}: ${item.summary}`),
      tags: [...new Set([item.name, item.title.toLowerCase(), item.category, item.domain, platform].filter(Boolean))],
      ...(props.length > 0 ? { props } : {}),
      examples: using.length > 0 ? using.slice(0, 1) : own.slice(0, 1),
      rules: rulesOf(item),
      status: STATUSES.has(item.status) ? item.status : "beta",
      ...(item.deprecated ? { deprecated: item.deprecated } : {}),
      platforms: [platform],
      related: item.related,
      docs: `https://ui.krizaka.com/components/${item.name}`,
    });
  };
  for (const item of items) for (const [platform, side] of sidesOf(item)) namesOf(side.import).forEach((name, index) => add(item, platform, side.entry, name, false, index === 0));
  // The names the examples import that no meta lists (a variant helper, a `/server` half, a sub-entry).
  for (const { item, platform, imports } of samples) for (const [module, name, typeOnly] of imports) add(item, platform, module, name, typeOnly);
  for (const [module, source] of Object.entries(sources)) for (const entry of documentedExports(module, source, items)) if (!entries.has(`${module} ${entry.name}`)) entries.set(`${module} ${entry.name}`, entry);
  return {
    schema: CATALOG_SCHEMA,
    library: pkg.name,
    version: pkg.version,
    language: "typescript",
    ...(pkg.description ? { summary: pkg.description } : {}),
    homepage: pkg.homepage ?? "https://ui.krizaka.com",
    entries: [...entries.values()].sort((a, b) => a.module.localeCompare(b.module) || a.name.localeCompare(b.name)),
  };
}

/**
 * The exports of an entry no meta and no example covers (`@krizaka/ui/button/text-link`), from their JSDoc: the first
 * paragraph is the summary, an `@example` block the example. An export without one has no example, so the guard sees it.
 */
export function documentedExports(module, source, items) {
  const owner = items.find((item) => item.name === module.split("/")[2]);
  const found = [];
  for (const block of source.split("/**").slice(1)) {
    const end = block.indexOf("*/");
    const declared = /^\s*export (?:declare )?(const|function|class|type|interface) (\w+)/.exec(block.slice(end + 2));
    if (end < 0 || !declared) continue;
    const doc = block.slice(0, end);
    const [, declaration, name] = declared;
    const text = doc.split("\n").map((line) => line.replace(/^\s*\* ?/, "")).join("\n");
    const [prose, example] = text.split(/^@example\s*$/m);
    const code = (example ?? "").replace(/^```\w*\n?|```\s*$/gm, "").trim();
    const typeOnly = TYPE_DECLARATIONS.has(declaration);
    found.push({
      name,
      kind: declaredKindOf(name, declaration, typeOnly),
      module,
      import: `import ${typeOnly ? "type " : ""}{ ${name} } from "${module}";`,
      ...(owner ? { title: owner.title } : {}),
      summary: plain(prose.split(/\n\s*\n|\n@/)[0].replaceAll("\n", " ").trim()) || name,
      tags: [module.split("/").slice(2).join(" "), ...(owner ? [owner.category] : [])],
      examples: code ? [{ title: name, language: "tsx", code }] : [],
      status: STATUSES.has(owner?.status) ? owner.status : "beta",
      platforms: ["web"],
      ...(owner ? { related: [owner.name], docs: `https://ui.krizaka.com/components/${owner.name}` } : {}),
    });
  }
  return found;
}

/** The entry points of package.json that hold code a product imports (no stylesheet, no data, no example). */
export const codeEntries = (pkg) =>
  Object.keys(pkg.exports)
    .filter((key) => key !== "." && !/\.(css|json)$/.test(key) && !key.startsWith("./registry"))
    .map((key) => `@krizaka/ui/${key.slice(2)}`);

/** The guard's two rules: the code entries no catalogue entry covers, and the entries without an example. */
export function catalogGaps(catalog, pkg) {
  // Sorted, so the recorded gaps (catalog-gaps.json) compare as they are written.
  const covered = new Set(catalog.entries.map((entry) => entry.module));
  return {
    uncovered: codeEntries(pkg).filter((module) => !covered.has(module)).sort((a, b) => a.localeCompare(b)),
    withoutExample: catalog.entries.filter((entry) => entry.examples.length === 0).map((entry) => `${entry.module} ${entry.name}`).sort((a, b) => a.localeCompare(b)),
  };
}

/** The source file of an entry (`@krizaka/ui/form/server` → `src/form/server.tsx`), or null. */
export function sourceFileOf(src, module, exists) {
  const sub = module.replace(/^@krizaka\/ui\//, "");
  return [`${sub}.ts`, `${sub}.tsx`, `${sub}/index.ts`, `${sub}/index.tsx`].map((file) => `${src}/${file}`).find((file) => exists(file)) ?? null;
}

/**
 * The catalogue of the package as it is on disk: the registry, plus the JSDoc of the entries the registry leaves out.
 * @param {(path: string) => boolean} exists
 * @param {(path: string) => string} read
 */
export async function packageCatalog(collectRegistry, pkg, src, exists, read) {
  const items = await collectRegistry();
  const uncovered = catalogGaps(catalogOf(items, pkg), pkg).uncovered;
  const sources = {};
  for (const module of uncovered) {
    const file = sourceFileOf(src, module, exists);
    if (file) sources[module] = read(file);
  }
  return catalogOf(items, pkg, sources);
}
