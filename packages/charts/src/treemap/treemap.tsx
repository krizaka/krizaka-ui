"use client";
// Part of a whole, nested — storage by project then by kind, credits by team then by model. Each top-level part keeps
// a palette slot and its children wear it; labels inside the rectangles take the text colour that reads best on the
// fill (WCAG contrast computed, never assumed); a click zooms into a part, the path is written above it. ECharts,
// loaded when the chart nears the screen.
import { useCallback, useMemo } from "react";

import { describeParts } from "../core/describe";
import { shareFormatter, valueFormatter } from "../core/format";
import { contrast } from "../core/palette";
import type { ValueFormat } from "../core/types";
import { EChartHost, type EngineProps, type WalkItem } from "../echarts/host";
import { baseOption, type ResolvedTheme, tooltipHtml } from "../echarts/theme";
import type { ChartFrameProps } from "../web/frame";
import { useSettings } from "../web/frame";

const engine = () => import("../echarts/engines/treemap");

/** A part: a name and either a value or children (whose values add up). */
export interface TreemapNode {
  readonly name: string;
  readonly value?: number;
  readonly children?: readonly TreemapNode[];
}

export interface TreemapProps extends ChartFrameProps, EngineProps {
  /** The top-level parts. */
  data: readonly TreemapNode[];
  /** How the values are written. */
  format?: ValueFormat;
  /** The headers of the data table. */
  pathLabel?: string;
/** The header of the values. */
  valueLabel?: string;
}

const total = (node: TreemapNode): number => node.value ?? (node.children ?? []).reduce((sum, child) => sum + total(child), 0);

function leaves(nodes: readonly TreemapNode[], path: string[] = []): { path: string[]; value: number }[] {
  return nodes.flatMap((n) => (n.children?.length ? leaves(n.children, [...path, n.name]) : [{ path: [...path, n.name], value: total(n) }]));
}

export function Treemap(props: TreemapProps) {
  const { data, format, pathLabel, valueLabel, title } = props;
  const { locale, labels } = useSettings(props);
  const fmt = useMemo(() => ({ value: valueFormatter(format, locale, labels.noValue), share: shareFormatter(locale) }), [format, locale, labels.noValue]);
  const parts = useMemo(() => data.map((n) => ({ label: n.name, value: total(n) })), [data]);
  const all = parts.reduce((sum, p) => sum + p.value, 0);
  const flat = useMemo(() => leaves(data), [data]);
  const isEmpty = all <= 0;
  const summary = isEmpty ? labels.empty : describeParts("treemap", parts, { labels, value: fmt.value, share: fmt.share });
  // The keyboard walks the top-level parts (ECharts numbers the tree depth-first: the root is 0).
  const items: WalkItem[] = useMemo(() => {
    const count = (n: TreemapNode): number => 1 + (n.children ?? []).reduce((sum, c) => sum + count(c), 0);
    // Each part's index: 1 (after the root) plus the sizes of the parts before it.
    const starts = data.map((_, i) => 1 + data.slice(0, i).reduce((sum, n) => sum + count(n), 0));
    return data.map((n, i) => ({ seriesIndex: 0, dataIndex: starts[i]!, text: `${n.name}: ${fmt.value(parts[i]!.value)} (${fmt.share(all ? parts[i]!.value / all : 0)})` }));
  }, [data, parts, all, fmt]);

  const build = useCallback(
    (theme: ResolvedTheme) => {
      const base = baseOption(theme, true);
      const ink = (fillColor: string) => (contrast(fillColor, theme.text) >= contrast(fillColor, theme.surface) ? theme.text : theme.surface);
      const toNode = (n: TreemapNode, color: string): Record<string, unknown> => ({
        name: n.name,
        value: total(n),
        itemStyle: { color },
        label: { color: ink(color) },
        upperLabel: { color: ink(color) },
        children: n.children?.map((c) => toNode(c, color)),
      });
      return {
        ...base,
        tooltip: {
          ...(base.tooltip as object),
          trigger: "item",
          formatter: (p: { treePathInfo: { name: string }[]; value: number }) => {
            const path = p.treePathInfo.slice(1).map((s) => s.name);
            return tooltipHtml(path.join(" › "), [{ label: valueLabel ?? labels.value, value: fmt.value(p.value) }, { label: "%", value: fmt.share(all ? p.value / all : 0) }]);
          },
        },
        series: [
          {
            type: "treemap",
            name: title,
            left: 0,
            right: 0,
            top: 0,
            bottom: 28,
            roam: false,
            nodeClick: "zoomToNode",
            data: data.map((n, i) => toNode(n, theme.palette[i % 8]!)),
            label: { show: true, fontFamily: theme.font, fontSize: 12, formatter: (p: { name: string; value: number }) => `${p.name}\n${fmt.value(p.value)}` },
            upperLabel: { show: true, height: 22, fontFamily: theme.font, fontSize: 11, fontWeight: 600 },
            itemStyle: { borderColor: theme.surface, borderWidth: 2, gapWidth: 2, borderRadius: 4 },
            levels: [{ itemStyle: { borderWidth: 0, gapWidth: 3 }, upperLabel: { show: false } }, { itemStyle: { borderColor: theme.surface, borderWidth: 2, gapWidth: 2 } }, { colorSaturation: [0.35, 0.6], itemStyle: { borderColor: theme.surface, borderWidth: 1, gapWidth: 1 } }],
            breadcrumb: { show: true, bottom: 0, left: 0, height: 22, itemStyle: { color: theme.surface2, borderColor: theme.border, textStyle: { color: theme.text } }, emphasis: { itemStyle: { color: theme.surface3 } } },
          },
        ],
      };
    },
    [data, fmt, all, valueLabel, title, labels.value],
  );

  return (
    <EChartHost
      kind="treemap"
      frame={props}
      defaultHeight={320}
      table={{ columns: [pathLabel ?? labels.category, valueLabel ?? labels.value, "%"], rows: flat.map((l) => [l.path.join(" › "), fmt.value(l.value), fmt.share(all ? l.value / all : 0)]) }}
      summary={summary}
      isEmpty={isEmpty}
      engine={engine}
      build={build}
      items={items}
    />
  );
}
