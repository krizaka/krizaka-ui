"use client";
// The way out for what the typed charts do not cover: any ECharts option, on the same frame — the theme (palette, text,
// tooltip surface resolved from the tokens, re-applied on a theme switch), the lazy engine, the states, the export —
// and the same duty: a title, a summary and the data as a table, written by you since the option is opaque.
import type { EChartsCoreOption } from "echarts/core";
import { useCallback } from "react";

import { EChartHost, type EngineProps, type WalkItem } from "../echarts/host";
import { baseOption, type ResolvedTheme } from "../echarts/theme";
import type { ChartFrameProps, TableModel } from "../web/frame";

const fullEngine = () => import("../echarts/engines/full");

export type { ResolvedTheme };

export interface ChartProps extends ChartFrameProps, EngineProps {
  /** The ECharts option, or a function of the resolved theme (colours as plain strings, the palette, the ramp). */
  option: EChartsCoreOption | ((theme: ResolvedTheme, size: { width: number; height: number }) => EChartsCoreOption);
  /**
   * Registers what the option needs, from `echarts/charts` and `echarts/components` (tree-shaken):
   * `() => import("./my-echarts")` where that module calls `use([...])`. Default: all of ECharts (~380 kB gzip).
   */
  modules?: () => Promise<unknown>;
  /** The written summary: an option says nothing on its own. */
  summaryText: string;
  /** The data as a table: the alternative of every chart. */
  table: TableModel;
  /** What the arrow keys walk (series and data indexes, and what each one says). */
  items?: readonly WalkItem[];
  /** A click (or Enter) on a data item. */
  onItem?: (item: { seriesIndex: number; dataIndex: number }) => void;
}

/** Any ECharts option, themed and framed like the typed charts. Memoise `option` when it is a function. */
export function Chart({ option, modules = fullEngine, summaryText, table, items, onItem, ...frame }: ChartProps) {
  const build = useCallback(
    (theme: ResolvedTheme, size: { width: number; height: number }) => {
      const own = typeof option === "function" ? option(theme, size) : option;
      return { ...baseOption(theme, true), ...own };
    },
    [option],
  );
  return (
    <EChartHost
      kind="chart"
      frame={{ ...frame, summaryText }}
      table={table}
      summary={summaryText}
      isEmpty={table.rows.length === 0}
      engine={modules}
      build={build}
      items={items}
      onItem={onItem}
    />
  );
}
