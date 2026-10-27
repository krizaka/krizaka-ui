import axe from "axe-core";

/** The slice of a Playwright `Page` this package needs: any page of `playwright` or `playwright-core` fits. */
export interface AuditablePage {
  evaluate<R>(pageFunction: string | ((arg: never) => R | Promise<R>), arg?: unknown): Promise<R>;
}

export interface A11yFinding {
  /** The axe rule id (`color-contrast`, `button-name`…). */
  rule: string;
  impact: Impact;
  /** The first selector of the failing node, with the volatile parts (ids, indexes) normalised. */
  target: string;
  help: string;
}

export type Impact = "minor" | "moderate" | "serious" | "critical";

/** WCAG 2.0/2.1 A and AA, plus axe's best practices (landmarks, headings). The set every Krizaka page is held to. */
export const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"] as const;

export interface AuditOptions {
  /** CSS selectors left out (a third-party widget we do not own). */
  exclude?: string[];
  tags?: readonly string[];
}

interface RawResult {
  id: string;
  impact?: string | null;
  help: string;
  nodes: { target: unknown[] }[];
}

/** Ids and positions change between renders (`#radix-:r3:`, `:nth-child(4)`); a finding must keep the same key. */
export function normaliseTarget(target: string): string {
  return target.replace(/:r[0-9a-z]+:/g, ":r#:").replace(/\d+/g, "#");
}

const IMPACTS: readonly string[] = ["minor", "moderate", "serious", "critical"];
const impactOf = (value: string | null | undefined): Impact => (IMPACTS.includes(value ?? "") ? (value as Impact) : "minor");
const selectorOf = (target: unknown[] | undefined): string => String(target?.[0] ?? "");

/** Turns axe's raw violations into one finding per failing node. */
export function findingsOf(violations: RawResult[]): A11yFinding[] {
  return violations.flatMap((v) =>
    v.nodes.map((n) => ({ rule: v.id, impact: impactOf(v.impact), help: v.help, target: normaliseTarget(selectorOf(n.target)) })),
  );
}

/**
 * Runs axe-core in the page, now (the caller has settled it: load, fonts, theme), and returns what fails.
 * axe is injected through `evaluate` (not a script tag), so a Content-Security-Policy cannot refuse it.
 */
export async function auditPage(page: AuditablePage, options: AuditOptions = {}): Promise<A11yFinding[]> {
  await page.evaluate(axe.source);
  const options_ = { runOnly: { type: "tag", values: [...(options.tags ?? AXE_TAGS)] }, resultTypes: ["violations"] };
  const context = options.exclude?.length ? JSON.stringify({ exclude: options.exclude.map((s) => [s]) }) : "document";
  const violations = await page.evaluate<RawResult[]>(
    `window.axe.run(${context}, ${JSON.stringify(options_)}).then((r) => r.violations)`,
  );
  return findingsOf(violations);
}
