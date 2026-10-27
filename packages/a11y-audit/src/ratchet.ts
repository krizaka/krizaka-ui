import { readFileSync, writeFileSync } from "node:fs";

import type { A11yFinding, Impact } from "./axe.js";

export interface RuleCount {
  impact: Impact;
  count: number;
}

/** The baseline file: per rule, how many distinct failing nodes today. Only ever goes down. */
export interface Baseline {
  app: string;
  rules: Record<string, RuleCount>;
}

export interface RatchetOutcome {
  /** New violations: the check fails. */
  problems: string[];
  /** Rules that went down: lock the gain with `update`. */
  gains: string[];
  counts: Record<string, RuleCount>;
}

export interface Where {
  route: string;
  theme: string;
}

const RANK: Record<Impact, number> = { minor: 0, moderate: 1, serious: 2, critical: 3 };

/**
 * Collects the findings of a whole crawl. A node counts once per rule, route, theme and selector — not once per
 * viewport width — so the same flaw seen at phone and desktop is one flaw.
 */
export class A11yCollector {
  private readonly seen = new Map<string, A11yFinding>();

  constructor(readonly app: string) {}

  add(where: Where, findings: A11yFinding[]): void {
    for (const f of findings) this.seen.set(`${f.rule}|${where.route}|${where.theme}|${f.target}`, f);
  }

  counts(): Record<string, RuleCount> {
    const out: Record<string, RuleCount> = {};
    for (const f of this.seen.values()) {
      const cur = out[f.rule];
      out[f.rule] = { impact: cur && RANK[cur.impact] >= RANK[f.impact] ? cur.impact : f.impact, count: (cur?.count ?? 0) + 1 };
    }
    return out;
  }

  /** The worst offenders first, for a human reading the log. */
  summary(): string[] {
    return Object.entries(this.counts())
      .sort(([, a], [, b]) => RANK[b.impact] - RANK[a.impact] || b.count - a.count)
      .map(([rule, c]) => `${c.impact.padEnd(8)} ${rule}: ${c.count}`);
  }

  /** The examples (one per rule) that explain a failing rule. */
  examples(rule: string, max = 5): string[] {
    return [...this.seen.entries()]
      .filter(([k]) => k.startsWith(`${rule}|`))
      .slice(0, max)
      .map(([k]) => k.slice(rule.length + 1));
  }
}

export function readBaseline(path: string, app: string): Baseline {
  try {
    return JSON.parse(readFileSync(path, "utf8")) as Baseline;
  } catch {
    return { app, rules: {} };
  }
}

/** Compares a crawl with its baseline: more violations of a rule (or a new rule) than recorded is a problem. */
export function compare(baseline: Baseline, counts: Record<string, RuleCount>): RatchetOutcome {
  const problems: string[] = [];
  const gains: string[] = [];
  for (const [rule, now] of Object.entries(counts)) {
    const before = baseline.rules[rule]?.count ?? 0;
    if (now.count > before) problems.push(`${rule} (${now.impact}): ${now.count} > baseline ${before}`);
  }
  for (const [rule, before] of Object.entries(baseline.rules)) {
    const now = counts[rule]?.count ?? 0;
    if (now < before.count) gains.push(`${rule}: ${before.count} -> ${now}`);
  }
  return { problems, gains, counts };
}

/** The baseline after a crawl: never higher than the one recorded (`init` writes today's counts as they are). */
export function lowered(baseline: Baseline, counts: Record<string, RuleCount>, init: boolean): Baseline {
  const rules: Record<string, RuleCount> = {};
  for (const [rule, now] of Object.entries(counts)) {
    const before = baseline.rules[rule]?.count;
    const count = init || before === undefined ? now.count : Math.min(before, now.count);
    if (count > 0) rules[rule] = { impact: now.impact, count };
  }
  return { app: baseline.app, rules: Object.fromEntries(Object.entries(rules).sort(([a], [b]) => a.localeCompare(b))) };
}

export interface FinishOptions {
  /** Path of the baseline file, committed at the repository root (`a11y-baseline.json`). */
  baseline: string;
  /** Lower the baseline to today's counts (never raises it). Default: the `--a11y-update` flag of the command line. */
  update?: boolean;
  /** Record today's counts as the baseline, whatever it held (first adoption only). Default: `--a11y-init`. */
  init?: boolean;
}

/**
 * The end of a crawl: compare with the baseline, write it when asked, and return the lines that fail the run.
 * Serious and critical violations that are not in the baseline fail, like any other new violation.
 */
export function finish(collector: A11yCollector, options: FinishOptions): { problems: string[]; notes: string[] } {
  const update = options.update ?? process.argv.includes("--a11y-update");
  const init = options.init ?? process.argv.includes("--a11y-init");
  const baseline = readBaseline(options.baseline, collector.app);
  const outcome = compare(baseline, collector.counts());
  const notes = collector.summary().map((l) => `a11y ${l}`);
  if (init || update) {
    writeFileSync(options.baseline, `${JSON.stringify(lowered(baseline, outcome.counts, init), null, 2)}\n`);
    notes.push(`a11y baseline written: ${options.baseline}`);
    return { problems: init ? [] : outcome.problems, notes };
  }
  if (outcome.gains.length) notes.push(`a11y baseline can go down (rerun with --a11y-update): ${outcome.gains.join(", ")}`);
  const problems = outcome.problems.map((p) => {
    const rule = p.split(" ")[0] ?? "";
    return `a11y ${p}; e.g. ${collector.examples(rule, 3).join(" ; ")}`;
  });
  return { problems, notes };
}
