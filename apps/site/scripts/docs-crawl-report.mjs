// WHY  The result of a documentation crawl is read by people (the PR comment, report.md) and by tools (report.json): one place
//      builds both from the list of problems.
// WHAT `buildReport(opts, paths, problems)`: the counts per category, the problems by component or page, and the Markdown.
// HOW  Imported by scripts/docs-crawl.mjs; nothing to run. Tests: tests/docs-crawl.test.mjs.
// OWNER krizaka-ui (lane platform), ADR-026 phase D.

import { CATEGORIES, componentOfPath, summarize } from "./docs-crawl-verdicts.mjs";

const sum = (o) => Object.values(o).reduce((x, y) => x + y, 0);

/** The failures (not tolerated) counted per component page (or per page) and per category. */
export function failuresByComponent(failures) {
  const byComponent = {};
  for (const p of failures) {
    const key = componentOfPath(p.page) ?? p.page;
    byComponent[key] ??= {};
    byComponent[key][p.category] = (byComponent[key][p.category] ?? 0) + 1;
  }
  return byComponent;
}

/* « interaction-error ×2, http-error ×1 »: the counts of one component or page, per category. */
const countsOf = (byCategory) =>
  Object.entries(byCategory)
    .map(([c, n]) => `${c} ×${n}`)
    .join(", ");

export function buildReport(opts, paths, problems) {
  const { counts, tolerated } = summarize(problems);
  const failures = problems.filter((p) => !p.tolerated);
  const byComponent = failuresByComponent(failures);
  const report = { base: opts.base, pages: paths.length, views: opts.views, counts, tolerated, total: failures.length, byComponent, problems };
  const md = [
    `# docs-crawl — ${opts.base}`,
    `${paths.length} pages × ${opts.views.join(" + ")}; ${failures.length} problem(s), ${problems.length - failures.length} tolerated.`,
    "",
    "| Category | Problems | Tolerated |",
    "|---|---:|---:|",
    ...CATEGORIES.map((c) => `| ${c} | ${counts[c]} | ${tolerated[c]} |`),
    "",
    "## By component or page",
    ...Object.entries(byComponent)
      .sort((a, b) => sum(b[1]) - sum(a[1]))
      .map(([k, v]) => `- ${k}: ${countsOf(v)}`),
    "",
    "## Problems",
    ...failures.map((p) => `- [${p.category}] ${p.view} ${p.page} — ${p.detail}`),
  ].join("\n");
  return { report, md, failures };
}
