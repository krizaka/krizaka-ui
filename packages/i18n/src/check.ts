/**
 * The catalogue gate: `<dir>/en.json` (the reference) and every other `<dir>/<locale>.json` have exactly the same keys,
 * no empty string, the same `{placeholders}` and the same markup (`<b>`, `<a>`, the only tags a message may carry).
 * Optionally, every key is read somewhere in the sources (`unused`). Run by `krizaka-i18n check <dir>` in each app's
 * lint and CI; it replaces the scripts each app used to carry.
 */
import fs from "node:fs";
import path from "node:path";

import { isPluralMessage, placeholdersOf } from "./format";
import type { PluralMessage } from "./types";

export type ProblemKind = "invalid" | "missing" | "unknown" | "empty" | "placeholders" | "markup" | "plural" | "unused";

export interface Problem {
  /** The catalogue the problem is in (`"fr"`), or the reference for an unused key. */
  locale: string;
  /** The dotted key (`site.nav.title`, `steps[2].title`), or the file for an invalid catalogue. */
  key: string;
  kind: ProblemKind;
  message: string;
}

export interface CheckOptions {
  /** The folder of the catalogues (`messages`): one `<locale>.json` per locale. */
  dir: string;
  /** The reference locale (default `en`): the others must match its keys. */
  reference?: string;
  /** Folders (or files) of sources: every key must appear in them (heuristic, see `findUnused`). */
  unused?: readonly string[];
}

export interface CheckResult {
  ok: boolean;
  reference: string;
  locales: string[];
  /** The number of messages of the reference (a plural set counts once). */
  messages: number;
  problems: Problem[];
}

type Leaf = string | PluralMessage;

/** The leaves of a catalogue by dotted key: strings, plural sets (one leaf) and other scalars; lists as `key[i]`. */
export function flatten(value: unknown, prefix = "", out = new Map<string, unknown>()): Map<string, unknown> {
  if (Array.isArray(value)) value.forEach((item, i) => flatten(item, `${prefix}[${i}]`, out));
  else if (value && typeof value === "object" && !isPluralMessage(value)) {
    for (const [key, item] of Object.entries(value)) flatten(item, prefix ? `${prefix}.${key}` : key, out);
  } else out.set(prefix, value);
  return out;
}

const forms = (leaf: Leaf): string[] => (typeof leaf === "string" ? [leaf] : (Object.values(leaf) as string[]));
const signature = (list: string[]): string => list.sort().join(",");
const placeholders = (leaf: Leaf): string => signature([...new Set(forms(leaf).flatMap(placeholdersOf))]);
const TAG = /<\/?([A-Za-z][\w-]*)[^>]*>/g;
const tags = (text: string): string[] => [...text.matchAll(TAG)].map((m) => m[0]);
const markup = (leaf: Leaf): string => signature([...new Set(forms(leaf).flatMap(tags))]);
const ALLOWED_TAGS = new Set(["<b>", "</b>", "<a>", "</a>"]);

function checkLeaf(locale: string, key: string, value: unknown, problems: Problem[]): value is Leaf {
  if (typeof value !== "string" && !isPluralMessage(value)) {
    problems.push({ locale, key, kind: "invalid", message: `${locale}: ${key} is not a message (${JSON.stringify(value)})` });
    return false;
  }
  for (const text of forms(value)) {
    if (!text.trim()) problems.push({ locale, key, kind: "empty", message: `${locale}: empty ${key}` });
    const bad = tags(text).filter((tag) => !ALLOWED_TAGS.has(tag));
    if (bad.length) problems.push({ locale, key, kind: "markup", message: `${locale}: unsupported markup ${bad.join(" ")} in ${key} (only <b> and <a>)` });
  }
  return true;
}

function load(file: string, problems: Problem[], locale: string): Map<string, unknown> | undefined {
  try {
    return flatten(JSON.parse(fs.readFileSync(file, "utf8")));
  } catch (error) {
    problems.push({ locale, key: file, kind: "invalid", message: `${locale}: cannot read ${file} (${(error as Error).message})` });
    return undefined;
  }
}

/** Runs the gate on a folder of catalogues. Never throws for a content problem: it reports. */
export function checkMessages(options: CheckOptions): CheckResult {
  const reference = options.reference ?? "en";
  const problems: Problem[] = [];
  const files = fs.existsSync(options.dir) ? fs.readdirSync(options.dir).filter((f) => f.endsWith(".json")).sort() : [];
  const locales = files.map((f) => f.slice(0, -".json".length));
  const result = (messages: number): CheckResult => ({ ok: problems.length === 0, reference, locales, messages, problems });

  if (!locales.includes(reference)) {
    problems.push({ locale: reference, key: options.dir, kind: "invalid", message: `no ${reference}.json in ${options.dir}` });
    return result(0);
  }
  const ref = load(path.join(options.dir, `${reference}.json`), problems, reference);
  if (!ref) return result(0);
  for (const [key, value] of ref) checkLeaf(reference, key, value, problems);

  for (const locale of locales.filter((l) => l !== reference)) {
    const other = load(path.join(options.dir, `${locale}.json`), problems, locale);
    if (!other) continue;
    for (const key of ref.keys()) if (!other.has(key)) problems.push({ locale, key, kind: "missing", message: `${locale}: missing ${key}` });
    for (const [key, value] of other) {
      if (!ref.has(key)) {
        problems.push({ locale, key, kind: "unknown", message: `${locale}: unknown ${key} (not in ${reference}.json)` });
        continue;
      }
      if (!checkLeaf(locale, key, value, problems)) continue;
      const expected = ref.get(key);
      if (typeof expected !== "string" && !isPluralMessage(expected)) continue;
      if (typeof expected !== typeof value) {
        problems.push({ locale, key, kind: "plural", message: `${locale}: ${key} must be ${typeof expected === "string" ? "a string" : "a plural set"} as in ${reference}.json` });
        continue;
      }
      if (placeholders(expected) !== placeholders(value)) problems.push({ locale, key, kind: "placeholders", message: `${locale}: placeholders differ in ${key}` });
      if (markup(expected) !== markup(value)) problems.push({ locale, key, kind: "markup", message: `${locale}: markup differs in ${key}` });
    }
  }

  if (options.unused?.length) {
    for (const key of findUnused([...ref.keys()], options.unused)) {
      problems.push({ locale: reference, key, kind: "unused", message: `unused ${key} (read nowhere in ${options.unused.join(", ")})` });
    }
  }
  return result(ref.size);
}

const SOURCE = /\.(?:[cm]?[jt]sx?)$/;
const SKIP_DIRS = new Set(["node_modules", ".next", "dist", "build", "coverage", ".turbo", ".git"]);

function readSources(entry: string, out: string[] = []): string[] {
  const stat = fs.statSync(entry, { throwIfNoEntry: false });
  if (!stat) return out;
  if (stat.isFile()) {
    if (SOURCE.test(entry)) out.push(fs.readFileSync(entry, "utf8"));
    return out;
  }
  for (const name of fs.readdirSync(entry)) if (!SKIP_DIRS.has(name)) readSources(path.join(entry, name), out);
  return out;
}

/** A branch taken whole: `const h = t.home;`, `messages("legal")` — `.home` or `"home"` not followed by `.` or a name. */
const wholeBranch = (branch: string): RegExp => new RegExp(`[.'"\`]${branch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\w.$-])`);

/**
 * The keys no source reads. A key counts as read when its dotted path appears in a source (`t("home.title")`,
 * `t.home.title`), when one of its branches is read dynamically (`` `home.${id}` ``, `home[id]`, `"home." + id`), or
 * when a branch is taken whole (`const h = t.home;`, `messages("legal")`).
 * A heuristic: it finds dead keys, it does not prove a key is shown.
 */
export function findUnused(keys: readonly string[], sources: readonly string[]): string[] {
  const text = sources.flatMap((entry) => readSources(entry)).join("\n");
  return keys.filter((full) => {
    const key = full.replace(/\[\d+\].*$/, "");
    if (text.includes(key)) return false;
    const parts = key.split(".");
    for (let i = parts.length - 1; i > 0; i--) {
      const branch = parts.slice(0, i).join(".");
      if (text.includes(`${branch}.\${`) || text.includes(`${branch}[`) || text.includes(`${branch}." +`) || text.includes(`${branch}.' +`)) return false;
      if (wholeBranch(branch).test(text)) return false;
    }
    return true;
  });
}

/** The human report of a check, as printed by the CLI. */
export function formatReport(result: CheckResult, limit = 50): string {
  if (result.ok) {
    return `✓ i18n: ${result.messages} messages, ${result.locales.length > 1 ? "every locale complete" : `${result.reference} only`}`;
  }
  const shown = result.problems.slice(0, limit).map((p) => p.message);
  const more = result.problems.length > limit ? `\n  … and ${result.problems.length - limit} more` : "";
  return `✗ i18n: ${result.problems.length} problem(s)\n  ${shown.join("\n  ")}${more}`;
}
