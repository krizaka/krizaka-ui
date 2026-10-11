"use client";
// Stages that lose people on the way — sign-up, verification, first video, first sale — with what the industry's
// funnels leave out: the conversion from each stage to the next and from the first, written beside each stage, in the
// summary and in the table. Ordinal steps of the brand hue (full → light), labels outside the shapes in the text
// colours. ECharts, loaded when the chart nears the screen.
import { useCallback, useMemo } from "react";

import { read } from "../core/data";
import { shareFormatter, valueFormatter } from "../core/format";
import { capitalize, fill } from "../core/labels";
import type { Accessor, Datum, ValueFormat } from "../core/types";
import { EChartHost, type EngineProps, type WalkItem } from "../echarts/host";
import { baseOption, type ResolvedTheme, tooltipHtml } from "../echarts/theme";
import type { ChartFrameProps } from "../web/frame";
import { useSettings } from "../web/frame";

const engine = () => import("../echarts/engines/funnel");

export interface FunnelProps<T extends Datum> extends ChartFrameProps, EngineProps {
  /** One row per stage, first stage first. */
  data: readonly T[];
  /** The field (or function) naming the stage. */
  label: Accessor<T, string>;
  /** The field of how many reached it. */
  value: Accessor<T, number>;
  /** How the counts are written. Default `"integer"`. */
  format?: ValueFormat;
  /** The headers of the data table: the stage, the count, the share of the first, of the previous. */
  stageLabel?: string;
/** The header of the counts. */
  valueLabel?: string;
/** The header of the share of the first stage. Default “% first”. */
  fromFirstLabel?: string;
/** The header of the share of the previous stage. Default “% previous”. */
  fromPreviousLabel?: string;
}

export function Funnel<T extends Datum>(props: FunnelProps<T>) {
  const { data, label, value, format = "integer", stageLabel, valueLabel, fromFirstLabel = "% first", fromPreviousLabel = "% previous" } = props;
  const { locale, labels } = useSettings(props);
  const fmt = useMemo(() => ({ value: valueFormatter(format, locale, labels.noValue), share: shareFormatter(locale) }), [format, locale, labels.noValue]);
  const stages = useMemo(() => data.map((d, i) => ({ label: String(read(label, d, i)), value: Math.max(0, Number(read(value, d, i)) || 0) })), [data, label, value]);
  const isEmpty = stages.length === 0 || stages.every((s) => s.value === 0);
  const first = stages[0]?.value ?? 0;
  const rate = useCallback((i: number) => (i === 0 || !stages[i - 1]!.value ? 1 : stages[i]!.value / stages[i - 1]!.value), [stages]);
  const overall = first && stages.length ? stages[stages.length - 1]!.value / first : 0;
  const summary = isEmpty
    ? labels.empty
    : [
        fill(labels.summaryIntro, { kind: labels.kinds.funnel, count: stages.length }),
        `${stages
          .slice(1)
          .map((s, k) => fill(labels.summaryConversion, { from: stages[k]!.label, to: s.label, rate: fmt.share(rate(k + 1)) }))
          .join(", ")}.`,
        `${capitalize(fill(labels.summaryOverall, { rate: fmt.share(overall) }))}.`,
      ].join(" ");
  const items: WalkItem[] = stages.map((s, i) => ({ seriesIndex: 0, dataIndex: i, text: `${s.label}: ${fmt.value(s.value)}${i ? ` (${fmt.share(rate(i))})` : ""}` }));

  const build = useCallback(
    (theme: ResolvedTheme, size: { width: number }) => {
      const base = baseOption(theme, true);
      const steps = [...theme.ramp].reverse();
      const labelRoom = Math.min(220, Math.max(120, size.width * 0.38));
      return {
        ...base,
        tooltip: {
          ...(base.tooltip as object),
          trigger: "item",
          formatter: (p: { dataIndex: number }) => {
            const i = p.dataIndex;
            const s = stages[i]!;
            return tooltipHtml(
              s.label,
              [
                { label: valueLabel ?? labels.value, value: fmt.value(s.value) },
                ...(i ? [{ label: fromPreviousLabel, value: fmt.share(rate(i)) }] : []),
                { label: fromFirstLabel, value: fmt.share(first ? s.value / first : 0) },
              ],
            );
          },
        },
        series: [
          {
            type: "funnel",
            sort: "none",
            left: 8,
            right: labelRoom,
            top: 8,
            bottom: 8,
            minSize: "8%",
            gap: 2,
            data: stages.map((s, i) => ({ name: s.label, value: s.value, itemStyle: { color: steps[Math.round((i / Math.max(1, stages.length - 1)) * (steps.length - 2))], borderWidth: 0 } })),
            label: {
              position: "right",
              color: theme.text,
              fontFamily: theme.font,
              fontSize: 12,
              formatter: (p: { dataIndex: number }) => {
                const i = p.dataIndex;
                return `{name|${stages[i]!.label}}  {value|${fmt.value(stages[i]!.value)}}${i ? `  {rate|${fmt.share(rate(i))}}` : ""}`;
              },
              rich: { name: { color: theme.text2, fontSize: 12 }, value: { color: theme.text, fontWeight: 600, fontSize: 12 }, rate: { color: theme.text3, fontSize: 11 } },
            },
            labelLine: { lineStyle: { color: theme.axis } },
            emphasis: { itemStyle: { borderColor: theme.text, borderWidth: 2 } },
          },
        ],
      };
    },
    [stages, fmt, first, valueLabel, fromFirstLabel, fromPreviousLabel, labels.value, rate],
  );

  return (
    <EChartHost
      kind="funnel"
      frame={props}
      defaultHeight={280}
      table={{
        columns: [stageLabel ?? labels.category, valueLabel ?? labels.value, fromFirstLabel, fromPreviousLabel],
        rows: stages.map((s, i) => [s.label, fmt.value(s.value), fmt.share(first ? s.value / first : 0), i ? fmt.share(rate(i)) : labels.noValue]),
      }}
      summary={summary}
      isEmpty={isEmpty}
      engine={engine}
      build={build}
      items={items}
    />
  );
}
