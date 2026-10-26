// The result of an AI analysis on the phone: header (studio, sentence, overall status, counts), findings grouped by status,
// limits and next steps, provenance. The rules (grouping, counts, exports) are the web's `model`, which is plain TypeScript.
import * as React from "react";
import { Pressable, StyleSheet, View, type ViewProps } from "react-native";

import {
  type AnalysisExport,
  type AnalysisFinding,
  type AnalysisReportData,
  type AnalysisReportLabels,
  type AnalysisStatus,
  countByStatus,
  exportReport,
  groupFindings,
} from "../analysis-report/model";
import { Badge, type BadgeTone } from "./badge";
import { Button } from "./button";
import { CardRoot } from "./card";
import { Txt } from "./txt";

export type { AnalysisExport, AnalysisFinding, AnalysisReportData, AnalysisReportLabels, AnalysisStatus };

const TONE = { inconsistent: "danger", attention: "warning", unverified: "neutral", consistent: "success" } as const satisfies Record<AnalysisStatus, BadgeTone>;

export type AnalysisReportProps = Omit<ViewProps, "children"> &
  AnalysisReportData & {
    /** Every word the report prints, passed translated (statuses, section titles, buttons). */
    labels: AnalysisReportLabels;
    /** The pack's bird, beside the studio's name. */
    mark?: React.ReactNode;
    /** Findings are still arriving. */
    streaming?: boolean;
    /** Makes a finding's location pressable. */
    onLocate?: (finding: AnalysisFinding) => void;
    /** Called with the text when the person asks to copy: the app puts it on the clipboard. */
    onCopy?: (kind: AnalysisExport, text: string) => void;
    /** Hides the copy buttons. */
    hideActions?: boolean;
  };

function Finding({ finding, labels, onLocate }: { finding: AnalysisFinding; labels: AnalysisReportLabels; onLocate?: AnalysisReportProps["onLocate"] }) {
  const [open, setOpen] = React.useState(false);
  return (
    <CardRoot style={styles.finding}>
      <View style={styles.row}>
        <Badge tone={TONE[finding.status]} dot>
          {labels.status[finding.status]}
        </Badge>
        {finding.code ? <Txt variant="mono" tone="secondary">{finding.code}</Txt> : null}
      </View>
      <Txt variant="label">{finding.title}</Txt>
      {finding.observation ? <Txt tone="secondary">{finding.observation}</Txt> : null}
      {finding.mayIndicate ? (
        <Txt tone="secondary">
          <Txt variant="label">{labels.mayIndicate}</Txt> {finding.mayIndicate}
        </Txt>
      ) : null}
      {finding.location ? (
        <Pressable role="button" disabled={!onLocate} onPress={() => onLocate?.(finding)} hitSlop={8}>
          <Txt variant="caption" tone={onLocate ? "accent" : "secondary"}>
            {labels.location} {finding.location}
          </Txt>
        </Pressable>
      ) : null}
      {finding.evidence ? (
        <View>
          <Pressable role="button" aria-expanded={open} onPress={() => setOpen(!open)} hitSlop={8}>
            <Txt variant="label" tone="accent">{labels.evidence}</Txt>
          </Pressable>
          {open ? <Txt variant="mono" tone="secondary">{finding.evidence}</Txt> : null}
        </View>
      ) : null}
    </CardRoot>
  );
}

function List({ title, items }: { title: string; items: readonly string[] | undefined }) {
  if (!items?.length) return null;
  return (
    <View style={styles.block}>
      <Txt variant="label">{title}</Txt>
      {items.map((i) => (
        <Txt key={i} tone="secondary">{`• ${i}`}</Txt>
      ))}
    </View>
  );
}

/** The web `AnalysisReport` on React Native. */
export function AnalysisReport({ title, summary, status, findings, limits, nextSteps, provenance, labels, mark, streaming, onLocate, onCopy, hideActions, style, ...props }: AnalysisReportProps) {
  const counts = countByStatus(findings);
  const report: AnalysisReportData = { title, summary, status, findings, limits, nextSteps, provenance };
  const rows = [
    [labels.model, provenance?.model],
    [labels.runId, provenance?.runId],
    [labels.duration, provenance?.duration],
    [labels.version, provenance?.version],
  ].filter((r): r is [string, string] => Boolean(r[1]));
  return (
    <View aria-busy={streaming || undefined} style={[styles.root, style]} {...props}>
      <View style={styles.row}>
        {mark}
        <View style={styles.grow}>
          <Txt variant="title">{title}</Txt>
          <Txt tone="secondary">{summary}</Txt>
        </View>
      </View>
      <View style={styles.row}>
        <Badge tone={TONE[status]} size="md" dot>
          {labels.status[status]}
        </Badge>
        {(Object.keys(counts) as AnalysisStatus[])
          .filter((k) => counts[k] > 0)
          .map((k) => (
            <Badge key={k} tone={TONE[k]}>{`${counts[k]} ${labels.status[k]}`}</Badge>
          ))}
      </View>
      {hideActions ? null : (
        <View style={styles.row}>
          <Button variant="outline" size="sm" label={labels.copyJson} onPress={() => onCopy?.("json", exportReport("json", report, labels))} />
          <Button variant="outline" size="sm" label={labels.copyMarkdown} onPress={() => onCopy?.("markdown", exportReport("markdown", report, labels))} />
        </View>
      )}
      {streaming ? <Txt role="status" aria-live="polite" variant="caption" tone="secondary">{labels.streaming}</Txt> : null}
      {findings.length === 0 && !streaming ? <Txt tone="secondary">{labels.noFindings}</Txt> : null}
      {groupFindings(findings).map((g) => (
        <View key={g.status} style={styles.block}>
          <Txt variant="label" tone="secondary" role="heading">{`${labels.status[g.status]} · ${g.findings.length}`}</Txt>
          {g.findings.map((f) => (
            <Finding key={f.id} finding={f} labels={labels} onLocate={onLocate} />
          ))}
        </View>
      ))}
      <List title={labels.limits} items={limits} />
      <List title={labels.nextSteps} items={nextSteps} />
      {rows.length ? (
        <View style={styles.block} aria-label={labels.provenance}>
          {rows.map(([k, v]) => (
            <Txt key={k} variant="caption" tone="secondary">{`${k}: ${v}`}</Txt>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: 16 },
  row: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 8 },
  grow: { flex: 1, gap: 4 },
  block: { gap: 8 },
  finding: { padding: 12, gap: 6 },
});
