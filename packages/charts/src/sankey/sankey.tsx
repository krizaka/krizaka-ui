"use client";
// Flows between stages — credits from plans to models to outcomes, viewers from sources to purchases — on ECharts
// (loaded when the chart nears the screen). Each node keeps its palette slot in order of appearance; links take
// their source's colour, softened.
import { useCallback, useMemo } from "react";

import { read } from "../core/data";
import { shareFormatter, valueFormatter } from "../core/format";
import { capitalize, fill } from "../core/labels";
import type { Accessor, Datum, ValueFormat } from "../core/types";
import { EChartHost, type EngineProps, type WalkItem } from "../echarts/host";
import { baseOption, type ResolvedTheme, tooltipHtml } from "../echarts/theme";
import type { ChartFrameProps } from "../web/frame";
import { useSettings } from "../web/frame";

const engine = () => import("../echarts/engines/sankey");

export interface SankeyProps<T extends Datum> extends ChartFrameProps, EngineProps {
  /** One row per flow. */
  data: readonly T[];
  /** The fields (or functions) naming where the flow comes from and where it goes. */
  source: Accessor<T, string>;
/** The field (or function) naming where the flow goes. */
  target: Accessor<T, string>;
  /** The field of its amount. */
  value: Accessor<T, number>;
  /** How the amounts are written. */
  format?: ValueFormat;
  /** Lay the stages out top to bottom (narrow screens). Default: left to right. */
  vertical?: boolean;
  /** The headers of the data table. */
  sourceLabel?: string;
/** The header of the targets. */
  targetLabel?: string;
/** The header of the amounts. */
  valueLabel?: string;
}

export function Sankey<T extends Datum>(props: SankeyProps<T>) {
  const { data, source, target, value, format, vertical, sourceLabel, targetLabel, valueLabel } = props;
  const { locale, labels } = useSettings(props);
  const fmt = useMemo(() => ({ value: valueFormatter(format, locale, labels.noValue), share: shareFormatter(locale) }), [format, locale, labels.noValue]);
  const model = useMemo(() => {
    const links = data.map((d, i) => ({ source: String(read(source, d, i)), target: String(read(target, d, i)), value: Number(read(value, d, i)) })).filter((l) => Number.isFinite(l.value) && l.value > 0);
    const nodes = [...new Set(links.flatMap((l) => [l.source, l.target]))];
    return { links, nodes };
  }, [data, source, target, value]);
  const isEmpty = model.links.length === 0;
  const total = model.links.filter((l) => !model.links.some((o) => o.target === l.source)).reduce((sum, l) => sum + l.value, 0);
  const top = [...model.links].sort((a, b) => b.value - a.value).slice(0, 3);
  const summary = isEmpty
    ? labels.empty
    : `${fill(labels.summaryIntro, { kind: labels.kinds.sankey, count: `${model.nodes.length} · ${model.links.length}` })} ${top.map((l) => fill(labels.summaryShare, { label: `${l.source} → ${l.target}`, value: fmt.value(l.value), share: fmt.share(total ? l.value / total : 0) })).join(", ")}. ${capitalize(fill(labels.summaryTotal, { total: fmt.value(total) }))}.`;
  const items: WalkItem[] = model.links.map((l, i) => ({ seriesIndex: 0, dataIndex: i, dataType: "edge", text: `${l.source} → ${l.target}: ${fmt.value(l.value)}` }));

  const build = useCallback(
    (theme: ResolvedTheme) => {
      const base = baseOption(theme, true);
      const colorOf = (name: string) => theme.palette[model.nodes.indexOf(name) % 8]!;
      return {
        ...base,
        tooltip: {
          ...(base.tooltip as object),
          trigger: "item",
          formatter: (p: { dataType: string; data: { source?: string; target?: string; value?: number; name?: string }; value: number; name: string }) =>
            p.dataType === "edge"
              ? tooltipHtml(`${p.data.source} → ${p.data.target}`, [{ label: valueLabel ?? labels.value, value: fmt.value(p.data.value), color: colorOf(p.data.source!) }])
              : tooltipHtml(p.name, [{ label: valueLabel ?? labels.value, value: fmt.value(p.value), color: colorOf(p.name) }]),
        },
        series: [
          {
            type: "sankey",
            orient: vertical ? "vertical" : "horizontal",
            left: 8,
            right: vertical ? 8 : 120,
            top: 8,
            bottom: vertical ? 40 : 8,
            nodeWidth: 12,
            nodeGap: 10,
            draggable: false,
            emphasis: { focus: "adjacency" },
            data: model.nodes.map((name) => ({ name, itemStyle: { color: colorOf(name), borderColor: theme.surface, borderWidth: 1 } })),
            links: model.links.map((l) => ({ ...l, lineStyle: { color: colorOf(l.source), opacity: 0.28 } })),
            label: { color: theme.text, fontSize: 11, fontFamily: theme.font },
            lineStyle: { curveness: 0.5 },
          },
        ],
      };
    },
    [model, fmt, vertical, valueLabel, labels.value],
  );

  return (
    <EChartHost
      kind="sankey"
      frame={props}
      defaultHeight={320}
      table={{ columns: [sourceLabel ?? labels.category, targetLabel ?? labels.value, valueLabel ?? labels.value], rows: model.links.map((l) => [l.source, l.target, fmt.value(l.value)]) }}
      summary={summary}
      isEmpty={isEmpty}
      engine={engine}
      build={build}
      items={items}
    />
  );
}
