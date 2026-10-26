// Client (the copy buttons, the folds). The result of an AI analysis, read in five seconds then deeper on demand: a header
// (studio, one sentence, overall status, counts), findings grouped by status (the most serious first), the limits and the
// next steps as a calm two-column section, a provenance footer, and copy as JSON / Markdown. Words arrive as props.
import * as React from "react";
import { tv } from "tailwind-variants";

import { Badge } from "../badge/badge";
import { Button } from "../button/button";
import {
  type AnalysisExport,
  type AnalysisFinding,
  type AnalysisReportData,
  type AnalysisReportLabels,
  type AnalysisStatus,
  countByStatus,
  exportReport,
  groupFindings,
} from "./model";

export const analysisReportStyles = tv({
  slots: {
    root: "flex w-full flex-col gap-6 text-fg",
    header: "flex items-start gap-4",
    headText: "flex min-w-0 flex-1 flex-col gap-2",
    title: "font-display text-xl font-bold tracking-tight text-fg",
    summary: "text-base text-fg-secondary",
    counts: "flex flex-wrap items-center gap-2",
    actions: "flex flex-wrap gap-2",
    group: "flex flex-col gap-3",
    groupTitle: "text-sm font-semibold text-fg-secondary",
    list: "flex flex-col gap-3",
    finding: "flex min-w-0 flex-col gap-2 rounded-lg border border-border-default bg-surface-1 p-4",
    findingHead: "flex flex-wrap items-center gap-2",
    code: "font-mono text-xs text-fg-secondary",
    findingTitle: "text-base font-semibold text-fg",
    muted: "text-sm text-fg-secondary",
    locate: "w-fit",
    fold: "text-sm text-fg-secondary",
    evidence: "mt-2 overflow-x-auto rounded-md border border-border-default bg-surface-2 p-3 font-mono text-xs text-fg focus-visible:focus-ring",
    foldSummary: "w-fit cursor-pointer rounded-sm font-semibold text-fg-accent focus-visible:focus-ring",
    columns: "grid gap-6 border-t border-border-default pt-6 @lg:grid-cols-2",
    column: "flex flex-col gap-2",
    columnTitle: "text-sm font-semibold text-fg",
    items: "flex list-disc flex-col gap-1 pl-5 text-sm text-fg-secondary",
    provenance: "flex flex-wrap gap-x-6 gap-y-1 border-t border-border-default pt-4 text-xs text-fg-secondary",
    term: "font-semibold text-fg",
    live: "text-sm text-fg-secondary",
  },
});

const TONE = { inconsistent: "danger", attention: "warning", unverified: "neutral", consistent: "success" } as const satisfies Record<AnalysisStatus, string>;

export type AnalysisReportProps = Omit<React.ComponentProps<"section">, "title" | "children"> &
  AnalysisReportData & {
    /** Every word the report prints, passed translated (statuses, section titles, buttons). */
    labels: AnalysisReportLabels;
    /** The pack's bird (a mark of `@krizaka/ui/mascots`), shown beside the studio's name. */
    mark?: React.ReactNode;
    /** Findings are still arriving: the list is announced politely and marked busy. */
    streaming?: boolean;
    /** Makes a finding's location a button (scroll a document viewer to it). */
    onLocate?: (finding: AnalysisFinding) => void;
    /** Called after the report is copied (`json` or `markdown`), with the copied text. Without a clipboard, the app can copy it here. */
    onCopy?: (kind: AnalysisExport, text: string) => void;
    /** Hides the copy buttons (a read-only embed). */
    hideActions?: boolean;
  };

function FindingCard({ finding, labels, onLocate }: { finding: AnalysisFinding; labels: AnalysisReportLabels; onLocate?: AnalysisReportProps["onLocate"] }) {
  const s = analysisReportStyles();
  return (
    <li className={s.finding()}>
      <div className={s.findingHead()}>
        <Badge tone={TONE[finding.status]} dot>
          {labels.status[finding.status]}
        </Badge>
        {finding.code ? <span className={s.code()}>{finding.code}</span> : null}
      </div>
      <h4 className={s.findingTitle()}>{finding.title}</h4>
      {finding.observation ? <p className={s.muted()}>{finding.observation}</p> : null}
      {finding.mayIndicate ? (
        <p className={s.muted()}>
          <span className={s.term()}>{labels.mayIndicate}</span> {finding.mayIndicate}
        </p>
      ) : null}
      {finding.location ? (
        onLocate ? (
          <Button variant="ghost" size="sm" className={s.locate()} onClick={() => onLocate(finding)}>
            {labels.location} {finding.location}
          </Button>
        ) : (
          <p className={s.muted()}>
            <span className={s.term()}>{labels.location}</span> {finding.location}
          </p>
        )
      ) : null}
      {finding.evidence ? (
        <details className={s.fold()}>
          <summary className={s.foldSummary()}>{labels.evidence}</summary>
          <pre tabIndex={0} className={s.evidence()}>
            <code>{finding.evidence}</code>
          </pre>
        </details>
      ) : null}
    </li>
  );
}

function TextColumn({ title, items }: { title: string; items: readonly string[] | undefined }) {
  const s = analysisReportStyles();
  if (!items?.length) return null;
  return (
    <section className={s.column()}>
      <h3 className={s.columnTitle()}>{title}</h3>
      <ul className={s.items()}>
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </section>
  );
}

function Provenance({ data, labels }: { data: NonNullable<AnalysisReportData["provenance"]>; labels: AnalysisReportLabels }) {
  const s = analysisReportStyles();
  const rows = [
    [labels.model, data.model],
    [labels.runId, data.runId],
    [labels.duration, data.duration],
    [labels.version, data.version],
  ].filter((r): r is [string, string] => Boolean(r[1]));
  if (!rows.length) return null;
  return (
    <dl aria-label={labels.provenance} className={s.provenance()}>
      {rows.map(([k, v]) => (
        <div key={k} className="flex gap-1.5">
          <dt className={s.term()}>{k}</dt>
          <dd className="font-mono">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

/** The result of an AI analysis: summary, findings by status, limits, next steps, provenance, copy as JSON or Markdown. */
export function AnalysisReport({ title, summary, status, findings, limits, nextSteps, provenance, labels, mark, streaming, onLocate, onCopy, hideActions, className, ...props }: AnalysisReportProps) {
  const s = analysisReportStyles();
  const [copied, setCopied] = React.useState<AnalysisExport | null>(null);
  const report: AnalysisReportData = { title, summary, status, findings, limits, nextSteps, provenance };
  const counts = countByStatus(findings);
  const heading = React.useId();
  const copy = (kind: AnalysisExport) => {
    const text = exportReport(kind, report, labels);
    void navigator.clipboard?.writeText(text).then(() => setCopied(kind));
    onCopy?.(kind, text);
  };
  return (
    <section aria-labelledby={heading} aria-busy={streaming || undefined} className={s.root({ className })} {...props}>
      <header className={s.header()}>
        {mark}
        <div className={s.headText()}>
          <h2 id={heading} className={s.title()}>
            {title}
          </h2>
          <p className={s.summary()}>{summary}</p>
          <div className={s.counts()}>
            <Badge tone={TONE[status]} size="md" dot>
              {labels.status[status]}
            </Badge>
            {(Object.keys(counts) as AnalysisStatus[])
              .filter((k) => counts[k] > 0)
              .map((k) => (
                <Badge key={k} tone={TONE[k]}>
                  {counts[k]} {labels.status[k]}
                </Badge>
              ))}
          </div>
        </div>
        {hideActions ? null : (
          <div className={s.actions()}>
            <Button variant="outline" size="sm" onClick={() => copy("json")}>
              {labels.copyJson}
            </Button>
            <Button variant="outline" size="sm" onClick={() => copy("markdown")}>
              {labels.copyMarkdown}
            </Button>
          </div>
        )}
      </header>
      <p role="status" className="sr-only">
        {copied ? labels.copied : streaming ? labels.streaming : ""}
      </p>
      <div aria-live={streaming ? "polite" : undefined} className="flex flex-col gap-6">
        {findings.length === 0 && !streaming ? <p className={s.live()}>{labels.noFindings}</p> : null}
        {groupFindings(findings).map((g) => (
          <section key={g.status} className={s.group()} aria-label={`${labels.findings}: ${labels.status[g.status]}`}>
            <h3 className={s.groupTitle()}>
              {labels.status[g.status]} · {g.findings.length}
            </h3>
            <ul className={s.list()}>
              {g.findings.map((f) => (
                <FindingCard key={f.id} finding={f} labels={labels} onLocate={onLocate} />
              ))}
            </ul>
          </section>
        ))}
      </div>
      {limits?.length || nextSteps?.length ? (
        <div className="@container">
          <div className={s.columns()}>
            <TextColumn title={labels.limits} items={limits} />
            <TextColumn title={labels.nextSteps} items={nextSteps} />
          </div>
        </div>
      ) : null}
      {provenance ? <Provenance data={provenance} labels={labels} /> : null}
    </section>
  );
}
