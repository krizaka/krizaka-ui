#!/usr/bin/env node
// tools/inventory.mjs — the final audit of the UI refactor (study §2.1): where does a concept of the @krizaka/ui
// catalogue still have a local implementation? Read-only: it only reads the clones of the products and of the site.
//
//   node tools/inventory.mjs                      # markdown report on stdout (clones under ~/krizaka-com)
//   node tools/inventory.mjs --json               # the same, as JSON (CI, scripts)
//   node tools/inventory.mjs --base ~/src/krizaka --repo krizaka-com=../krizaka-com-p64
//   node tools/inventory.mjs --strict             # exit 1 when a duplicate is left
//
// How a local definition is classified (by name, then by signature):
//   - "adaptateur"  — it bears a catalogue name (Button, Dialog…) but builds on the primitive (imports it);
//   - "composite"   — a product component carrying the concept in its name (AuctionStatusBadge, CostConfirmDialog)
//                     that builds on the primitive or on the product design system, or that §2.2 lists as a product
//                     composite: legitimate (level 2 or 3);
//   - "doublon"     — a local implementation that imports neither: to migrate onto @krizaka/ui;
//   - "signature"   — no catalogue name, but the file re-does what a primitive does (role="dialog", role="switch",
//                     role="tablist", a theme class toggled by hand, cmdk used directly): a duplicate too.
//
// A product that imports the primitives through its own door (`components/ui/index.ts`, which re-exports
// `@krizaka/ui/*` and gives them the product's words) builds on them as much as a direct import does: a name imported
// from the door counts as an import of the module the door takes it from (`doorSources`).
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

/** The concepts of the catalogue (study §2.1), most specific first: a name is given to the first concept it matches. */
export const CONCEPTS = [
  {
    id: "confirm",
    label: "Confirmation d'action",
    target: "@krizaka/ui/confirm-button · AlertDialog",
    names: ["ConfirmDialog", "ConfirmButton", "ConfirmIconButton", "AlertDialog"],
    suffix: /^\w*Confirm\w*(Dialog|Button|Modal)$/,
    primitive: /@krizaka\/ui\/(confirm-button|dialog)\b/,
  },
  {
    id: "command",
    label: "Palette de commandes / recherche",
    target: "@krizaka/ui/command",
    names: ["Command", "CommandPalette", "SearchCommand", "GlobalSearchModal", "SearchModal", "SearchPalette"],
    suffix: /(CommandPalette|SearchCommand|SearchModal|SearchPalette)$/,
    primitive: /@krizaka\/ui\/command\b/,
    signature: /from\s+["']cmdk["']/,
  },
  {
    id: "theme",
    label: "Thème (provider, bascule)",
    target: "@krizaka/ui/theme",
    names: ["ThemeProvider", "ThemeToggle", "ThemeModeSelector", "ThemeSwitcher", "ThemeSwitch"],
    suffix: /^Theme\w*(Provider|Toggle|Selector|Switcher|Switch)$/,
    primitive: /@krizaka\/ui\/theme\b/,
    signature: /classList\.(add|remove|toggle)\(\s*["'`](light|dark)["'`]/,
  },
  {
    id: "dialog",
    label: "Dialogue / feuille",
    target: "@krizaka/ui/dialog",
    names: ["Dialog", "Sheet", "Modal", "BottomSheet", "Drawer"],
    suffix: /(Dialog|Sheet|Modal|Drawer)$/,
    primitive: /@krizaka\/ui\/(dialog|command)\b/,
    signature: /role=["']dialog["']|aria-modal=|createPortal\(/,
  },
  {
    id: "toast",
    label: "Toast",
    target: "@krizaka/ui/toast",
    names: ["Toast", "Toaster", "ToastProvider", "ToastContext", "ToastOverlay"],
    suffix: /(Toasts?|ToastContext|ToastOverlay|ToastProvider)$/,
    primitive: /@krizaka\/ui\/toast\b/,
  },
  {
    id: "tabs",
    label: "Onglets / segments",
    target: "@krizaka/ui/tabs · Segmented",
    names: ["Tabs", "Segmented", "Segments", "SegmentedControl", "TabBar"],
    suffix: /(Tabs|Segmented|Segments|SegmentedControl)$/,
    primitive: /@krizaka\/ui\/tabs\b/,
    signature: /role=["']tablist["']/,
  },
  {
    id: "switch",
    label: "Switch",
    target: "@krizaka/ui/switch",
    names: ["Switch", "Toggle"],
    suffix: /Switch$/,
    primitive: /@krizaka\/ui\/switch\b/,
    signature: /role=["']switch["']/,
  },
  {
    id: "slider",
    label: "Slider",
    target: "@krizaka/ui/slider",
    names: ["Slider", "Range"],
    suffix: /Slider$/,
    primitive: /@krizaka\/ui\/slider\b/,
    signature: /role=["']slider["']|type=["']range["']/,
  },
  {
    id: "countdown",
    label: "Compte à rebours",
    target: "@krizaka/ui/countdown",
    names: ["Countdown", "CountdownTimer"],
    suffix: /Countdown$/,
    primitive: /@krizaka\/ui\/countdown\b/,
  },
  {
    id: "avatar",
    label: "Avatar",
    target: "@krizaka/ui/avatar",
    names: ["Avatar", "AvatarGroup"],
    suffix: /Avatar$/,
    primitive: /@krizaka\/ui\/avatar\b/,
  },
  {
    id: "skeleton",
    label: "Squelette / vide / état async",
    target: "@krizaka/ui/skeleton · empty-state · spinner",
    names: ["Skeleton", "Empty", "EmptyState", "AsyncState", "Spinner", "Loader"],
    suffix: /(Skeleton|EmptyState|AsyncState)$/,
    primitive: /@krizaka\/ui\/(skeleton|empty-state|spinner)\b/,
  },
  {
    id: "field",
    label: "Champ de formulaire",
    target: "@krizaka/ui/field · checkbox · radio-group",
    names: ["Input", "Field", "TextField", "Textarea", "Select", "Checkbox", "FormField"],
    suffix: /(Field|Input)$/,
    primitive: /@krizaka\/ui\/(field|checkbox|radio-group)\b/,
  },
  {
    id: "badge",
    label: "Badge / pastille / chip",
    target: "@krizaka/ui/badge · chip",
    names: ["Badge", "Chip", "Pill", "Tag"],
    suffix: /(Badge|Chip|Pill)$/,
    primitive: /@krizaka\/ui\/(badge|chip)\b/,
  },
  {
    id: "card",
    label: "Carte",
    target: "@krizaka/ui/card",
    names: ["Card", "CardHeader", "CardBody", "CardFooter", "Panel", "Tile", "Tiles"],
    suffix: /Card$/,
    primitive: /@krizaka\/ui\/(card|stat)\b/,
  },
  {
    id: "button",
    label: "Bouton",
    target: "@krizaka/ui/button",
    names: ["Button", "IconButton", "PrimaryButton", "buttonClass", "buttonVariants"],
    suffix: /Button$/,
    primitive: /@krizaka\/ui\/(button|confirm-button)\b/,
  },
];

/** Product composites the study lists as legitimate (§2.2, level 2), whatever they import. */
export const COMPOSITES = new Set([
  "AuctionStatusBadge", "LiveBadge", "SocialIcon", "StoryRing", "AgeGate", "SentinelMini", "PackCard", "StudioCard",
  "NotificationBell",
]);

/** An import that builds on the platform for every concept: React Native gets all its primitives from one entry. */
const NATIVE = /@krizaka\/ui\/native\b/;
/** The product design systems: a component built on them builds on the primitives they re-export. */
const PRODUCT_KIT = /@krizaka\/(orochia|orazaka)-design-system\b/;

/** The clones scanned, relative to the base folder (default ~/krizaka-com). `slug` is the GitHub repository. */
export const REPOS = [
  { name: "krizaka-com", path: ".", slug: "krizaka/krizaka-com", prompt: "P2.6 / P3.2 transposés au site", skip: ["products", "company", "orazaka-content", "content", "public"] },
  { name: "orochia-web", path: "products/orochia/apps/web", slug: "krizaka/orochia", prompt: "P2.6, P3.2, P5.1 (Orochia web)" },
  { name: "orochia-admin", path: "products/orochia-admin", slug: "krizaka/orochia-admin", prompt: "P3.3 (Orochia admin)" },
  { name: "orochia-design-system", path: "products/orochia-design-system", slug: "krizaka/orochia-design-system", prompt: "P2.4, P5.1 PR 3 (kit Orochia)" },
  { name: "orochia-mobile", path: "products/orochia-mobile", slug: "krizaka/orochia-mobile", prompt: "P6.2 (Orochia mobile)" },
  { name: "orazaka-ui-kit", path: "products/orazaka/orazaka-apps/ui/orazaka-ui-kit", slug: "krizaka/orazaka-ui-kit", prompt: "P2.5 (kit Orazaka)" },
  { name: "orazaka-web-client", path: "products/orazaka/orazaka-apps/ui/orazaka-web-client", slug: "krizaka/orazaka-web-client", prompt: "P3.4 (Orazaka web-client)" },
  { name: "orazaka-web-admin", path: "products/orazaka/orazaka-apps/ui/orazaka-web-admin", slug: "krizaka/orazaka-web-admin", prompt: "P3.4 appliqué à l'admin Orazaka" },
  { name: "orazaka-mobile-client", path: "products/orazaka/orazaka-apps/ui/orazaka-mobile-client", slug: "krizaka/orazaka-mobile-client", prompt: "P6.2 appliqué à Orazaka mobile" },
];

const SKIP_DIRS = new Set([
  "node_modules", ".next", "dist", "build", "out", "coverage", "storybook-static", ".turbo", ".expo", "android", "ios",
  "__screenshots__", "e2e", ".git", ".vercel", ".source", "test", "tests", "__tests__", "__mocks__",
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
  return out.sort();
}

const DEFINITION = /^(?:export\s+)?(?:default\s+)?(?:async\s+)?(?:function\s+([A-Za-z_$][\w$]*)|(?:const|let)\s+([A-Za-z_$][\w$]*)\s*(?::[^=\n]+)?=\s*([^\n]*))/gm;

/** The top-level definitions of a file: components (capitalised) and the few lower-case helpers the catalogue names. */
export function definitions(text) {
  const names = [];
  for (const m of text.matchAll(DEFINITION)) {
    const name = m[1] ?? m[2];
    // `const Tabs = createBottomTabNavigator()`: a library's factory, not a component written here.
    if (m[3] !== undefined && /^create[A-Z]\w*\(/.test(m[3])) continue;
    if (/^[A-Z]/.test(name) || name === "buttonClass" || name === "buttonVariants") names.push(name);
  }
  return [...new Set(names)];
}

/** The concept a name belongs to, and how (`name`: a catalogue name; `suffix`: a product component). */
export function conceptOf(name) {
  for (const c of CONCEPTS) if (c.names.includes(name)) return { concept: c, by: "name" };
  for (const c of CONCEPTS) if (c.suffix.test(name)) return { concept: c, by: "suffix" };
  return undefined;
}

/** The named items of an import or export clause (`{ A, B as C, type D }`): `[{ name, as }]`. */
function clauseItems(clause) {
  const braces = /\{([^}]*)\}/.exec(clause);
  if (!braces) return [];
  return braces[1]
    .split(",")
    .map((item) => item.trim().replace(/^type\s+/, ""))
    .filter(Boolean)
    .map((item) => {
      const [name, as = name] = item.split(/\s+as\s+/).map((x) => x.trim());
      return { name, as };
    });
}

const IMPORTS = /import\s+(?:type\s+)?([^;]*?)\s+from\s+["']([^"']+)["']/g;
const EXPORTS_FROM = /export\s+(?:type\s+)?(\{[^}]*\})\s+from\s+["']([^"']+)["']/g;
const DOOR = /(^|\/)components\/ui\/index\.(tsx?|jsx?|mjs)$/;
const EXTENSIONS = ["", ".ts", ".tsx", ".js", ".jsx", ".mjs", "/index.ts", "/index.tsx", "/index.js"];

/** The imports of a file: `[{ spec, names: [{ name, as }] }]`. */
export function importsOf(text) {
  return [...text.matchAll(IMPORTS)].map((m) => ({ spec: m[2], names: clauseItems(m[1]) }));
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

/**
 * Classifies one file: its definitions that bear a concept, then the concepts it re-does without one. `door` lists
 * the package modules the file reaches through the product's door (`doorSources`).
 * @returns {{ symbol: string, concept: string, status: "adaptateur" | "composite" | "doublon" | "signature", why: string }[]}
 */
export function classify(text, door = []) {
  const findings = [];
  const direct = (c) => c.primitive.test(text) || NATIVE.test(text);
  const builds = (c) => direct(c) || door.some((spec) => c.primitive.test(spec));
  const onKit = PRODUCT_KIT.test(text) || door.some((spec) => PRODUCT_KIT.test(spec));
  const seen = new Set();
  for (const symbol of definitions(text)) {
    const hit = conceptOf(symbol);
    if (!hit) continue;
    const { concept: c, by } = hit;
    seen.add(c.id);
    if (COMPOSITES.has(symbol)) findings.push({ symbol, concept: c.id, status: "composite", why: "listé en §2.2" });
    else if (builds(c)) findings.push({ symbol, concept: c.id, status: by === "name" ? "adaptateur" : "composite", why: direct(c) ? "importe la primitive" : "importe la primitive par la porte du produit" });
    else if (by === "suffix" && onKit) findings.push({ symbol, concept: c.id, status: "composite", why: "sur le design system produit" });
    else findings.push({ symbol, concept: c.id, status: "doublon", why: "n'importe pas la primitive" });
  }
  for (const c of CONCEPTS) {
    if (!c.signature || seen.has(c.id) || builds(c) || !c.signature.test(text)) continue;
    // A portal alone is not a dialog: it needs the dialog semantics too.
    if (c.id === "dialog" && !/role=["']dialog["']|aria-modal=/.test(text)) continue;
    findings.push({ symbol: definitions(text).find((n) => /^[A-Z][a-z]/.test(n)) ?? "—", concept: c.id, status: "signature", why: `signature ${c.signature.source.slice(0, 40)}` });
  }
  return findings;
}

/** Scans every repository. Missing clones are reported, never fatal. */
export function inventory({ base = join(homedir(), "krizaka-com"), overrides = {} } = {}) {
  const repos = [];
  for (const repo of REPOS) {
    const path = overrides[repo.name] ? resolve(overrides[repo.name]) : join(base, repo.path);
    if (!existsSync(path) || !statSync(path).isDirectory()) {
      repos.push({ ...repo, path, missing: true, files: 0, findings: [] });
      continue;
    }
    const files = sourceFiles(path, repo.skip);
    const findings = [];
    const door = readDoor(files);
    for (const file of files) {
      const rel = relative(path, file).split(sep).join("/");
      if (ILLUSTRATION.test(rel)) continue;
      const text = readFileSync(file, "utf8");
      for (const f of classify(text, doorSources(text, file, path, door))) findings.push({ ...f, file: rel });
    }
    repos.push({ ...repo, path, missing: false, files: files.length, findings });
  }
  return { date: new Date().toISOString().slice(0, 10), base, repos };
}

const isDuplicate = (f) => f.status === "doublon" || f.status === "signature";
const STATUS = { doublon: "doublon à migrer", signature: "doublon (signature)", composite: "composite produit légitime", adaptateur: "adaptateur de la primitive" };

/** The report as markdown: a summary per repository, then the concepts, then what each repository has to migrate. */
export function toMarkdown(report) {
  const lines = [`# Inventaire UI — ${report.date}`, "", "Concepts du catalogue `@krizaka/ui` (étude §2.1) encore implémentés localement. Lecture seule.", ""];
  lines.push("| Dépôt | Fichiers | Doublons à migrer | Composites légitimes | Adaptateurs |", "| :-- | --: | --: | --: | --: |");
  for (const r of report.repos) {
    if (r.missing) {
      lines.push(`| ${r.name} | — | clone absent | | |`);
      continue;
    }
    const n = (s) => r.findings.filter(s).length;
    lines.push(`| ${r.name} | ${r.files} | ${n(isDuplicate)} | ${n((f) => f.status === "composite")} | ${n((f) => f.status === "adaptateur")} |`);
  }
  const total = report.repos.flatMap((r) => r.findings).filter(isDuplicate).length;
  lines.push("", total === 0 ? "**Aucun doublon** : seuls restent des composites produit et des adaptateurs." : `**${total} doublon(s) à migrer.**`, "");
  for (const c of CONCEPTS) {
    const rows = report.repos.flatMap((r) => r.findings.filter((f) => f.concept === c.id).map((f) => ({ ...f, repo: r.name })));
    if (rows.length === 0) continue;
    lines.push(`## ${c.label} → \`${c.target}\``, "", "| Dépôt | Fichier | Symbole | Statut |", "| :-- | :-- | :-- | :-- |");
    for (const f of rows.sort((a, b) => Number(isDuplicate(b)) - Number(isDuplicate(a)) || a.repo.localeCompare(b.repo))) {
      lines.push(`| ${f.repo} | \`${f.file}\` | \`${f.symbol}\` | ${STATUS[f.status]} (${f.why}) |`);
    }
    lines.push("");
  }
  return lines.join("\n");
}

/** What one repository has to migrate, as the body of an issue. */
export function issueBody(repo) {
  const dups = repo.findings.filter(isDuplicate);
  const label = (id) => CONCEPTS.find((c) => c.id === id);
  return [
    `L'audit final du programme UI (\`krizaka-ui/tools/inventory.mjs\`, étude §2.1) trouve ${dups.length} implémentation(s) locale(s) de concepts du catalogue \`@krizaka/ui\` dans ce dépôt :`,
    "",
    "| Fichier | Symbole | Concept | Cible |",
    "| :-- | :-- | :-- | :-- |",
    ...dups.map((f) => `| \`${f.file}\` | \`${f.symbol}\` | ${label(f.concept).label} | \`${label(f.concept).target}\` |`),
    "",
    `**Prompt de migration** (company/prompts-claude-code.md) : ${repo.prompt}. Règle : un composite produit garde son nom s'il est construit sur la primitive (niveau 2/3, §2.2) ; une copie de primitive disparaît au profit de \`@krizaka/ui\`.`,
    "",
    "Vérification : `node tools/inventory.mjs --repo <ce-dépôt>=<chemin>` dans krizaka-ui ne doit plus lister ce dépôt en « doublon ».",
  ].join("\n");
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { values } = parseArgs({
    options: {
      json: { type: "boolean" },
      strict: { type: "boolean" },
      base: { type: "string" },
      repo: { type: "string", multiple: true },
      help: { type: "boolean", short: "h" },
    },
  });
  if (values.help) {
    console.log("Usage: node tools/inventory.mjs [--json] [--strict] [--base <dir>] [--repo <name>=<path>]…");
    process.exit(0);
  }
  const expand = (p) => (p.startsWith("~") ? join(homedir(), p.slice(1)) : isAbsolute(p) ? p : resolve(p));
  const overrides = Object.fromEntries((values.repo ?? []).map((r) => r.split("=")).map(([k, v]) => [k, expand(v)]));
  const report = inventory({ base: values.base ? expand(values.base) : undefined, overrides });
  console.log(values.json ? JSON.stringify(report, null, 2) : toMarkdown(report));
  const total = report.repos.flatMap((r) => r.findings).filter(isDuplicate).length;
  process.exit(values.strict && total > 0 ? 1 : 0);
}
