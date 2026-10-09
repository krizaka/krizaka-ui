/**
 * The source gate: no user-facing text written in the code. It parses `.tsx` files with the TypeScript compiler API
 * (an optional peer dependency, handed in by the caller) and reports JSX text, user-facing attributes given as
 * literals (`placeholder`, `title`, `aria-label`, `alt`, `label`), messages handed to state setters
 * (`setError("…")`), words in data (`{ label: "…" }`) and browser dialogs (`alert`, `confirm`, `prompt`).
 *
 * Words of three letters or more count; the app's brand names are allowed (`allow`). A deliberate exception carries
 * `i18n-ignore` in a comment on the same line or the line above. Next.js `metadata` / `generateMetadata` objects are
 * left out (crawlers read them, not users).
 */
import fs from "node:fs";
import path from "node:path";

import type * as TS from "typescript";

export interface ScanOptions {
  /** Folders (or `.tsx` files) to scan. */
  paths: readonly string[];
  /** Words allowed as written: brand names (`["Krizaka"]`). */
  allow?: readonly string[];
  /** Files to leave out, as regular expressions on the path (tests and stories are always left out). */
  skip?: readonly (RegExp | string)[];
  /** Paths are reported relative to this folder (default: the current directory). */
  root?: string;
}

export interface Offender {
  file: string;
  line: number;
  /** `text`, `attr <name>`, `set <setter>`, `prop <name>` or `dialog`. */
  kind: string;
  text: string;
}

const ATTRS = new Set(["placeholder", "title", "aria-label", "alt", "label"]);
const SETTER = /^set\w*(Error|Message|Notice|Hint|Status|Feedback|Toast)$/;
const PROPS = new Set(["label", "hint", "title", "placeholder", "description", "message", "text", "caption"]);
const ALWAYS_SKIP = [/\.test\.tsx?$/, /\.spec\.tsx?$/, /\.stories\.tsx$/];
const SKIP_DIRS = new Set(["node_modules", ".next", "dist", "build", "coverage"]);

function* tsxFiles(entry: string): Generator<string> {
  const stat = fs.statSync(entry, { throwIfNoEntry: false });
  if (!stat) return;
  if (stat.isFile()) {
    if (entry.endsWith(".tsx")) yield entry;
    return;
  }
  for (const name of fs.readdirSync(entry).sort()) if (!SKIP_DIRS.has(name)) yield* tsxFiles(path.join(entry, name));
}

/** Scans the sources and returns every hard-coded user-facing string, in file and line order. */
export function scanHardcoded(ts: typeof TS, options: ScanOptions): Offender[] {
  const allowed = new Set(options.allow ?? []);
  const skip = [...ALWAYS_SKIP, ...(options.skip ?? []).map((s) => (typeof s === "string" ? new RegExp(s) : s))];
  const root = options.root ?? process.cwd();
  const words = (text: string) => (text.match(/[A-Za-zÀ-ÿ]{3,}/g) ?? []).filter((w) => !allowed.has(w));

  type Shown = { text: string; node: TS.Node };
  /** The string literals an expression can display: itself, or the branches of conditionals and logical operators. */
  const shownStrings = (expr: TS.Expression): Shown[] => {
    if (ts.isParenthesizedExpression(expr)) return shownStrings(expr.expression);
    if (ts.isStringLiteral(expr) || ts.isNoSubstitutionTemplateLiteral(expr)) return words(expr.text).length ? [{ text: expr.text, node: expr }] : [];
    if (ts.isTemplateExpression(expr)) {
      const parts = [expr.head, ...expr.templateSpans.map((s) => s.literal)].map((p) => p.text);
      return words(parts.join(" ")).length ? [{ text: parts.join("…"), node: expr }] : [];
    }
    if (ts.isConditionalExpression(expr)) return [...shownStrings(expr.whenTrue), ...shownStrings(expr.whenFalse)];
    if (ts.isBinaryExpression(expr)) {
      const op = expr.operatorToken.kind;
      if (op === ts.SyntaxKind.AmpersandAmpersandToken) return shownStrings(expr.right);
      if (op === ts.SyntaxKind.BarBarToken || op === ts.SyntaxKind.QuestionQuestionToken) return [...shownStrings(expr.right), ...shownStrings(expr.left)];
    }
    return [];
  };
  const isMetadata = (node: TS.Node): boolean => {
    for (let n = node.parent; n; n = n.parent) {
      if (ts.isVariableDeclaration(n) && n.name.getText() === "metadata") return true;
      if (ts.isFunctionDeclaration(n) && n.name?.getText() === "generateMetadata") return true;
    }
    return false;
  };

  const offenders: Offender[] = [];
  for (const entry of options.paths) {
    for (const file of tsxFiles(entry)) {
      if (skip.some((re) => re.test(file.split(path.sep).join("/")))) continue;
      const source = fs.readFileSync(file, "utf8");
      const lines = source.split("\n");
      const sf = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
      const report = (node: TS.Node, kind: string, text: string) => {
        const line = sf.getLineAndCharacterOfPosition(node.getStart()).line;
        if (lines.slice(Math.max(0, line - 1), line + 1).some((l) => l.includes("i18n-ignore"))) return;
        offenders.push({ file: path.relative(root, file), line: line + 1, kind, text: text.replace(/\s+/g, " ").trim().slice(0, 80) });
      };
      const visit = (node: TS.Node): void => {
        if (ts.isJsxText(node)) {
          if (words(node.text).length) report(node, "text", node.text);
        } else if (ts.isJsxAttribute(node) && ATTRS.has(node.name.getText()) && node.initializer && ts.isStringLiteral(node.initializer)) {
          if (words(node.initializer.text).length) report(node, `attr ${node.name.getText()}`, node.initializer.text);
        } else if (ts.isJsxExpression(node) && node.expression && (!ts.isJsxAttribute(node.parent) || ATTRS.has(node.parent.name.getText()))) {
          // A string shown as is, or as a branch of `cond ? "a" : "b"`, `x && "a"`, `x ?? "a"`, or a template's text.
          for (const lit of shownStrings(node.expression)) report(lit.node, "text", lit.text);
        } else if (ts.isCallExpression(node)) {
          const callee = node.expression.getText();
          if (/^(window\.)?(alert|confirm|prompt)$/.test(callee)) report(node, "dialog", callee);
          else if (SETTER.test(callee)) for (const arg of node.arguments) for (const lit of shownStrings(arg)) report(lit.node, `set ${callee}`, lit.text);
        } else if (ts.isPropertyAssignment(node) && PROPS.has(node.name.getText()) && !isMetadata(node)) {
          for (const lit of shownStrings(node.initializer)) report(lit.node, `prop ${node.name.getText()}`, lit.text);
        }
        ts.forEachChild(node, visit);
      };
      visit(sf);
    }
  }
  return offenders;
}
