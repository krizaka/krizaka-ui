// The registry of @krizaka/sovkora-design-system — the same format as @krizaka/ui's (krizaka-ui
// packages/ui/scripts/registry.mjs), so krizaka.com renders both with one generator: for every component, its
// documentation carried by the code (the `<name>.meta.ts` beside it), its named examples with their code, the props of
// its components (react-docgen-typescript, from their JSDoc) or the variants of its class function; and the
// foundations — the roles theme.css overrides, resolved in both modes with their contrasts, the product tokens, the
// typography, the icons and the product rules (foundations.meta.ts). Read by `build-registry.mjs` (which writes
// `registry/*.json`, rendered by krizaka.com/docs/sovkora/ui) and by `registry.test.mjs`.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve as resolvePath, sep } from "node:path";
import { pathToFileURL } from "node:url";

import docgen from "react-docgen-typescript";

import { blocks, contrasts, hex, read, resolve } from "./theme-model.mjs";

export const PKG = resolvePath(import.meta.dirname, "..");
export const PACKAGE = "@krizaka/sovkora-design-system";
export const PRODUCT = "sovkora";
const SRC = join(PKG, "src");
const COMPONENTS = join(SRC, "components");
const THEME = join(SRC, "theme.css");
export const EXAMPLES = join(PKG, "registry", "examples");

const posix = (path) => path.split(sep).join("/");

/** Every documented component: one `components/<name>.meta.ts` each. */
export const componentNames = () =>
  readdirSync(COMPONENTS)
    .filter((f) => f.endsWith(".meta.ts"))
    .map((f) => f.replace(/\.meta\.ts$/, ""))
    .sort();

/** Reads a component's documentation: plain data in erasable TypeScript, imported by Node (type stripping). */
export async function readMeta(name) {
  const { meta } = await import(pathToFileURL(join(COMPONENTS, `${name}.meta.ts`)).href);
  return meta;
}

export async function readFoundationsMeta() {
  const { foundations } = await import(pathToFileURL(join(PKG, "foundations.meta.ts")).href);
  return foundations;
}

/** The file of an example: `registry/examples/<name>/<example>.tsx`. */
export const exampleFileOf = (name, example) => join(EXAMPLES, name, `${example}.tsx`);

/**
 * What the package re-exports from @krizaka/ui, by name: every `export { … } from "@krizaka/ui…"` reachable from its
 * entries (relative re-exports followed).
 */
export function reexportsFromUi() {
  const found = new Map();
  const seen = new Set();
  const visitRelative = (file, from) => {
    const base = resolvePath(dirname(file), from);
    for (const candidate of [`${base}.ts`, `${base}.tsx`, join(base, "index.ts")]) visit(candidate);
  };
  const visit = (file) => {
    if (seen.has(file) || !existsSync(file)) return;
    seen.add(file);
    const source = readFileSync(file, "utf8");
    for (const [, list, from] of source.matchAll(/export\s*\{([^}]+)\}\s*from\s*"([^"]+)"/g)) {
      if (from.startsWith("@krizaka/ui")) for (const n of exportedNames(list)) found.set(n, from);
      else if (from.startsWith(".")) visitRelative(file, from);
    }
    for (const [, from] of source.matchAll(/export\s*\*\s*from\s*"([^"]+)"/g)) {
      if (from.startsWith(".")) visitRelative(file, from);
    }
  };
  visit(join(SRC, "index.ts"));
  return [...found].map(([name, from]) => ({ name, from })).sort((a, b) => a.name.localeCompare(b.name));
}

/** The value names of an `export { a, b as c, type T }` list, as exported (`a`, `c`): the types are left out. */
function exportedNames(list) {
  return list
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s && !s.startsWith("type "))
    .map((s) => s.split(/\s+/).pop());
}

/** A prop is the component's own when it is declared in the package (inherited DOM props are not). */
function isOwnProp(prop) {
  const declarations = prop.declarations ?? [];
  if (declarations.length === 0) return !prop.parent?.fileName.includes("node_modules");
  return declarations.some((d) => !d.fileName.includes("node_modules"));
}

const unquote = (value) => (value == null ? null : String(value).replace(/^(["'`])(.*)\1$/, "$2"));

/** The props of every component the package declares (components/*.tsx), by component name. */
export function collectProps() {
  const files = [
    ...readdirSync(COMPONENTS)
      .filter((f) => f.endsWith(".tsx"))
      .map((f) => join(COMPONENTS, f)),
    join(SRC, "icon.tsx"),
  ];
  const parser = docgen.withCustomConfig(join(PKG, "tsconfig.json"), {
    savePropValueAsString: true,
    shouldRemoveUndefinedFromOptional: true,
    propFilter: isOwnProp,
  });
  const byComponent = {};
  for (const doc of parser.parse(files)) {
    if (!/^[A-Z]/.test(doc.displayName)) continue;
    byComponent[doc.displayName] = {
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
    };
  }
  return byComponent;
}

/** A component's examples, with the code a reader copies and the module the documentation renders. */
function examplesOf(name, list) {
  return (list ?? []).map((example) => {
    const file = exampleFileOf(name, example.name);
    const path = posix(relative(join(PKG, "registry"), file));
    return {
      ...example,
      path,
      module: `${PACKAGE}/registry/${path.replace(/\.tsx$/, "")}`,
      code: existsSync(file) ? readFileSync(file, "utf8") : "",
    };
  });
}

const importLine = (names, from) => `import { ${names.join(", ")} } from "${from}";`;

/** The whole registry: one item per component, in name order. */
export async function collectRegistry() {
  const props = collectProps();
  const items = [];
  for (const name of componentNames()) {
    const meta = await readMeta(name);
    const entry = PACKAGE;
    const webProps = meta.web.imports.map((n) => props[n]).filter(Boolean);
    items.push({
      name,
      type: "composite",
      title: meta.title,
      summary: meta.summary,
      description: meta.summary,
      why: meta.why,
      status: meta.status,
      deprecated: meta.deprecated ?? null,
      category: meta.category,
      platforms: meta.platforms,
      builtOn: meta.builtOn,
      whenToUse: meta.whenToUse,
      whenNotToUse: meta.whenNotToUse,
      bestPractices: meta.bestPractices,
      accessibility: meta.accessibility,
      related: meta.related,
      web: {
        entry,
        import: importLine(meta.web.imports, entry),
        props: webProps,
        examples: examplesOf(name, meta.web.examples),
      },
      native: null,
      dependencies: [],
      registryDependencies: [],
    });
  }
  return items;
}

/** The roles theme.css sets, by mode (`--kz-` stripped), and the product tokens it declares. */
export function themeOverrides() {
  const own = blocks(readFileSync(THEME, "utf8"));
  const strip = (decls) =>
    Object.fromEntries(
      Object.entries(decls)
        .filter(([n]) => n.startsWith("--kz-"))
        .map(([n, v]) => [n.slice(5), v]),
    );
  return {
    dark: strip(own.get(":root, .theme-dark") ?? {}),
    light: strip(own.get("html.light") ?? {}),
    product: Object.entries({ ...own.get(":root, .theme-dark"), ...own.get(":root") }).filter(([n]) =>
      n.startsWith("--sovkora-"),
    ),
  };
}

/** The roles a page shows on the palette, in reading order. */
export const PALETTE = [
  "surface-0",
  "surface-1",
  "surface-2",
  "surface-3",
  "border-default",
  "text-primary",
  "text-secondary",
  "text-muted",
  "accent",
  "accent-hover",
  "accent-soft",
  "accent-text",
  "accent-2",
  "on-accent",
  "ring",
  "success",
  "warning",
  "danger",
  "info",
];

/**
 * The foundations: the theme as an app resolves it (platform → Sovkora brand → theme.css), mode by mode — every role of
 * the palette with its value, its hex and where it comes from — the contrasts, the product tokens, and foundations.meta.
 */
export async function collectFoundations() {
  const meta = await readFoundationsMeta();
  const kz = blocks(read("@krizaka/tokens/tokens.css"));
  const brand = blocks(read("@krizaka/tokens/brands/sovkora.css"));
  const own = blocks(readFileSync(THEME, "utf8"));
  // What applies in each mode, in cascade order: in light, every `html.light` rule outweighs every `:root` rule.
  const dark = [
    ["platform", { ...kz.get(":root, .theme-dark"), ...kz.get(":root") }],
    ["brand", brand.get(":root, .theme-dark") ?? {}],
    ["kit", own.get(":root, .theme-dark") ?? {}],
  ];
  const layers = {
    dark,
    light: [
      ...dark,
      ["platform", kz.get("html.light") ?? {}],
      ["brand", brand.get("html.light") ?? {}],
      ["kit", own.get("html.light") ?? {}],
    ],
  };
  const modes = {};
  const themes = {};
  // Every property the brand or the kit sets, in either mode: what a scoped preview must declare in both.
  const scoped = [
    ...new Set(
      Object.values(layers).flatMap((stack) =>
        stack.filter(([id]) => id !== "platform").flatMap(([, decls]) => Object.keys(decls)),
      ),
    ),
  ].sort((a, b) => Number(a > b) - Number(a < b));
  for (const [mode, stack] of Object.entries(layers)) {
    const theme = Object.assign({}, ...stack.map(([, decls]) => decls));
    themes[mode] = theme;
    const source = (role) => [...stack].reverse().find(([, decls]) => `--kz-${role}` in decls)?.[0] ?? "platform";
    modes[mode] = {
      name: meta.modes[mode],
      roles: PALETTE.map((role) => {
        const value = resolve(theme, `--kz-${role}`);
        return { role, value, hex: hex(value), source: source(role), note: meta.roles[role] ?? null };
      }),
      contrasts: contrasts(theme),
    };
  }
  const overrides = themeOverrides();
  return {
    product: PRODUCT,
    theme: meta.theme,
    summary: meta.summary,
    layers: [
      { id: "platform", source: "@krizaka/tokens/tokens.css" },
      { id: "brand", source: "@krizaka/tokens/brands/sovkora.css" },
      { id: "kit", source: `${PACKAGE}/theme.css` },
    ],
    modes,
    // The kit's own values, by mode: what krizaka.com applies to a preview (the brand layer is .brand-sovkora there).
    scope: Object.fromEntries(
      Object.entries(themes).map(([mode, theme]) => [
        mode,
        { ...Object.fromEntries(scoped.map((n) => [n, theme[n]])), ...Object.fromEntries(overrides.product) },
      ]),
    ),
    namedThemes: Object.entries(meta.namedThemes).map(([id, about]) => {
      const block =
        own.get(
          id === "electric" ? "html.theme-electric, .theme-electric" : `html.theme-${id}, .theme-${id}, html.${id}`,
        ) ?? {};
      const base = block["color-scheme"] === "light" || id === "solarized" ? themes.light : themes.dark;
      const theme = { ...base, ...block };
      return {
        id,
        name: about.name,
        use: about.use,
        scheme: id === "solarized" ? "light" : "dark",
        roles: PALETTE.map((role) => {
          const value = resolve(theme, `--kz-${role}`);
          return { role, value, hex: hex(value), source: `--kz-${role}` in block ? "kit" : "base", note: null };
        }),
        contrasts: contrasts(theme),
        scope: block,
      };
    }),
    typeScale: Object.entries(own.get(":root") ?? {})
      .filter(([n]) => n.startsWith("--text-"))
      .map(([name, value]) => ({ name, value })),
    productTokens: overrides.product.map(([name, value]) => ({
      name,
      value,
      description: meta.productTokens[name] ?? null,
    })),
    typography: meta.typography,
    icons: meta.icons,
    rules: meta.rules,
    native: meta.native,
  };
}
