// The rules of an analysis report, shared by the web entry and tested alone: the order of the statuses, the grouping of the
// findings (the most serious first), the counts, and the two exports (JSON, Markdown). No words of its own: the labels arrive.

/** How a finding or a whole report reads, from the most serious to the calmest. */
export const ANALYSIS_STATUSES = ["inconsistent", "attention", "unverified", "consistent"] as const;
export type AnalysisStatus = (typeof ANALYSIS_STATUSES)[number];

export type AnalysisFinding = {
  id: string;
  status: AnalysisStatus;
  /** The rule's identifier, in mono (`PDF-META-002`). */
  code?: string;
  title: string;
  /** What was observed. */
  observation?: string;
  /** What it may indicate, with its honest caveat. */
  mayIndicate?: string;
  /** Where in the document: « metadata », « page 3 ». `onLocate` receives the finding. */
  location?: string;
  /** The raw evidence, shown in a code block. */
  evidence?: string;
};

export type AnalysisProvenance = { model?: string; runId?: string; duration?: string; version?: string };

export type AnalysisReportData = {
  /** The studio's name (« Document validation »). */
  title: string;
  /** One sentence: the answer. */
  summary: string;
  /** The overall status of the report. */
  status: AnalysisStatus;
  /** The findings, in any order: the report groups them by status, the most serious first. */
  findings: readonly AnalysisFinding[];
  /** « What this report did not examine ». */
  limits?: readonly string[];
  /** What to do next, one step per item. */
  nextSteps?: readonly string[];
  /** Where the result comes from: model, run id, duration, version. */
  provenance?: AnalysisProvenance;
};

/** Every word the report prints, passed translated (the package ships none). */
export type AnalysisReportLabels = {
  status: Record<AnalysisStatus, string>;
  findings: string;
  mayIndicate: string;
  location: string;
  evidence: string;
  details: string;
  limits: string;
  nextSteps: string;
  provenance: string;
  model: string;
  runId: string;
  duration: string;
  version: string;
  copyJson: string;
  copyMarkdown: string;
  copied: string;
  /** Said while findings are still arriving. */
  streaming: string;
  /** Said when the report has no finding. */
  noFindings: string;
};

export type AnalysisExport = "json" | "markdown";

/** The findings grouped by status, the most serious group first; empty groups are left out. */
export function groupFindings(findings: readonly AnalysisFinding[]): { status: AnalysisStatus; findings: AnalysisFinding[] }[] {
  return ANALYSIS_STATUSES.map((status) => ({ status, findings: findings.filter((f) => f.status === status) })).filter((g) => g.findings.length > 0);
}

/** How many findings wear each status (zero included, so a count row is stable). */
export function countByStatus(findings: readonly AnalysisFinding[]): Record<AnalysisStatus, number> {
  const counts = { inconsistent: 0, attention: 0, unverified: 0, consistent: 0 } satisfies Record<AnalysisStatus, number>;
  for (const f of findings) counts[f.status] += 1;
  return counts;
}

export function reportToJson(report: AnalysisReportData): string {
  return JSON.stringify(report, null, 2);
}

const bullets = (items: readonly string[]) => items.map((i) => `- ${i}`);

function findingLines(f: AnalysisFinding, labels: AnalysisReportLabels): string[] {
  const head = `### ${f.code ? `\`${f.code}\` · ` : ""}${f.title}`;
  return [
    head,
    ...(f.observation ? ["", f.observation] : []),
    ...(f.mayIndicate ? ["", `**${labels.mayIndicate}** ${f.mayIndicate}`] : []),
    ...(f.location ? ["", `**${labels.location}** ${f.location}`] : []),
    ...(f.evidence ? ["", "```", f.evidence, "```"] : []),
    "",
  ];
}

function provenanceLines(p: AnalysisProvenance | undefined, labels: AnalysisReportLabels): string[] {
  const rows: [string, string | undefined][] = [
    [labels.model, p?.model],
    [labels.runId, p?.runId],
    [labels.duration, p?.duration],
    [labels.version, p?.version],
  ];
  return rows.filter((r): r is [string, string] => Boolean(r[1])).map(([k, v]) => `- ${k}: ${v}`);
}

/** The report as Markdown, in the same order as the page. */
export function reportToMarkdown(report: AnalysisReportData, labels: AnalysisReportLabels): string {
  const sections: string[][] = [
    [`# ${report.title}`, "", `**${labels.status[report.status]}** — ${report.summary}`],
    ...groupFindings(report.findings).map((g) => [`## ${labels.status[g.status]}`, "", ...g.findings.flatMap((f) => findingLines(f, labels))]),
    ...(report.limits?.length ? [[`## ${labels.limits}`, "", ...bullets(report.limits)]] : []),
    ...(report.nextSteps?.length ? [[`## ${labels.nextSteps}`, "", ...bullets(report.nextSteps)]] : []),
    ...(provenanceLines(report.provenance, labels).length ? [[`## ${labels.provenance}`, "", ...provenanceLines(report.provenance, labels)]] : []),
  ];
  return sections.map((s) => s.join("\n").trimEnd()).join("\n\n") + "\n";
}

/** The text of an export. */
export function exportReport(kind: AnalysisExport, report: AnalysisReportData, labels: AnalysisReportLabels): string {
  return kind === "json" ? reportToJson(report) : reportToMarkdown(report, labels);
}
