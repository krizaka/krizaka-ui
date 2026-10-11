"use client";
// The ECharts host behind Radar, Heatmap, Calendar, Sankey, Funnel, Candlestick, Treemap, Scatter and <Chart>: the same
// frame as the SVG charts (title, summary, data table, keyboard, states, export), and an engine that is loaded only
// when the chart comes near the screen — `echarts/core`, the one chart type and its components, one renderer (SVG by
// default; canvas for large volumes). The option is rebuilt from the resolved theme on every theme change; motion
// follows the reader's preference; the chart is disposed with the component.
import type { EChartsCoreOption, EChartsType } from "echarts/core";
import { type KeyboardEvent, type ReactNode, type RefObject, useEffect, useRef, useState } from "react";

import type { ChartKind } from "../core/labels";
import { ChartFrame, type ChartFrameProps, type TableModel } from "../web/frame";
import { useInView, useReducedMotion, useThemeVersion } from "../web/hooks";
import { type ResolvedTheme, resolveTheme } from "./theme";

export type Renderer = "svg" | "canvas";

/** What the keyboard walks: one ECharts data item, and what it says. */
export interface WalkItem {
  readonly seriesIndex: number;
  readonly dataIndex: number;
  /** A graph's link (`edge`) rather than its node: Sankey's flows. */
  readonly dataType?: "node" | "edge";
  readonly text: string;
}

export interface EngineProps {
  /** `svg` (default): sharp, exportable as SVG. `canvas`: for tens of thousands of marks. */
  renderer?: Renderer;
}

interface HostProps {
  readonly kind: ChartKind;
  readonly frame: ChartFrameProps & EngineProps;
  readonly defaultHeight?: number;
  readonly table: TableModel;
  readonly summary: string;
  readonly isEmpty: boolean;
  readonly legend?: ReactNode;
  /** Loads the chart type and its components (a dynamic import of `./engines/<type>`), whose `install` registers them. */
  readonly engine: () => Promise<unknown>;
  /** The option, from the resolved theme and the size. Memoise it: a new function redraws. */
  readonly build: (theme: ResolvedTheme, size: { width: number; height: number }) => EChartsCoreOption;
  readonly items?: readonly WalkItem[];
  /** A click (or Enter) on an item. */
  readonly onItem?: (item: { seriesIndex: number; dataIndex: number }) => void;
}

type Init = (el: HTMLElement, theme: null, options: { renderer: Renderer; width: number; height: number }) => EChartsType;
type RendererModule = { init: Init; install: () => void };

const RENDERERS: Record<Renderer, () => Promise<RendererModule>> = {
  svg: () => import("./engines/svg") as Promise<RendererModule>,
  canvas: () => import("./engines/canvas") as Promise<RendererModule>,
};

/** Calls the `install` of an engine module (a typed chart's), if it has one (a `<Chart modules>` function may not). */
const install = (module: unknown) => {
  const fn = (module as { install?: unknown } | null)?.install;
  if (typeof fn === "function") fn();
};

export function EChartHost({ kind, frame, defaultHeight, table, summary, isEmpty, legend, engine, build, items = [], onItem }: HostProps) {
  const instance = useRef<EChartsType | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);
  const renderer = frame.renderer ?? "svg";

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const n = items.length;
    if (!n) return;
    if (event.key === "Enter" && active !== null && onItem) {
      onItem(items[active]!);
      return;
    }
    const moves: Record<string, () => number | null> = {
      ArrowRight: () => ((active ?? -1) + 1) % n,
      ArrowDown: () => ((active ?? -1) + 1) % n,
      ArrowLeft: () => ((active ?? 0) - 1 + n) % n,
      ArrowUp: () => ((active ?? 0) - 1 + n) % n,
      Home: () => 0,
      End: () => n - 1,
      Escape: () => null,
    };
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    setActive(move());
  };

  const exportImage = (format: "png" | "svg") => {
    const chart = instance.current;
    if (!chart) return null;
    const dom = chart.getDom();
    const background = resolveTheme(dom).surface;
    return chart.getDataURL({ type: format === "svg" && renderer === "svg" ? "svg" : "png", pixelRatio: 2, backgroundColor: background });
  };

  return (
    <ChartFrame
      kind={kind}
      frame={{ ...frame, error: frame.error ?? (failed || undefined) }}
      defaultHeight={defaultHeight}
      table={table}
      summary={summary}
      isEmpty={isEmpty}
      legend={legend}
      announcement={active === null ? "" : (items[active]?.text ?? "")}
      handlers={{ onKeyDown, onBlur: () => setActive(null) }}
      navigable={items.length > 0}
      exportImage={exportImage}
    >
      {(width, height) => (
        <Host
          width={width}
          height={height}
          renderer={renderer}
          engine={engine}
          build={build}
          active={active === null ? null : (items[active] ?? null)}
          instance={instance}
          onItem={onItem}
          onFail={() => setFailed(true)}
        />
      )}
    </ChartFrame>
  );
}

interface InnerProps {
  width: number;
  height: number;
  renderer: Renderer;
  engine: () => Promise<unknown>;
  build: HostProps["build"];
  active: WalkItem | null;
  instance: RefObject<EChartsType | null>;
  onItem?: HostProps["onItem"];
  onFail: () => void;
}

function Host({ width, height, renderer, engine, build, active, instance, onItem, onFail }: InnerProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const near = useInView(ref, { once: true, margin: "200px" });
  const reduced = useReducedMotion();
  const themeVersion = useThemeVersion();
  const [ready, setReady] = useState(false);
  const [drawn, setDrawn] = useState(false);
  // The latest size and callbacks, read by the loader without restarting it.
  const size = useRef({ width, height });
  const itemRef = useRef(onItem);
  const failRef = useRef(onFail);
  useEffect(() => {
    size.current = { width, height };
    itemRef.current = onItem;
    failRef.current = onFail;
  });

  // Load the engine once the chart is near the screen; init; dispose with the component.
  useEffect(() => {
    if (!near) return undefined;
    let alive = true;
    Promise.all([engine(), RENDERERS[renderer]()]).then(
      ([module, painter]) => {
        if (!alive || !ref.current) return;
        install(module);
        painter.install();
        const { init } = painter;
        const chart = init(ref.current, null, { renderer, ...size.current });
        chart.on("finished", () => setDrawn(true));
        chart.on("click", (params) => {
          const p = params as { seriesIndex?: number; dataIndex?: number };
          if (p.seriesIndex != null && p.dataIndex != null) itemRef.current?.({ seriesIndex: p.seriesIndex, dataIndex: p.dataIndex });
        });
        instance.current = chart;
        setReady(true);
      },
      () => alive && failRef.current(),
    );
    return () => {
      alive = false;
      instance.current?.dispose();
      instance.current = null;
      setReady(false);
    };
  }, [near, renderer, engine, instance]);

  useEffect(() => {
    if (ready) instance.current?.resize({ width, height });
  }, [ready, width, height, instance]);

  // The option: rebuilt from the theme resolved on the chart's element, on every change of data, size or theme.
  useEffect(() => {
    const chart = instance.current;
    if (!ready || !chart || !ref.current) return;
    const option = build(resolveTheme(ref.current), { width, height });
    chart.setOption({ ...option, animation: !reduced && (option.animation as boolean | undefined) !== false }, { notMerge: true });
  }, [ready, build, themeVersion, reduced, width, height, instance]);

  // The keyboard's active item: ECharts' own tooltip and highlight.
  useEffect(() => {
    const chart = instance.current;
    if (!ready || !chart) return;
    chart.dispatchAction({ type: "downplay" });
    if (active) {
      const target = { seriesIndex: active.seriesIndex, dataIndex: active.dataIndex, ...(active.dataType ? { dataType: active.dataType } : {}) };
      chart.dispatchAction({ type: "highlight", ...target });
      chart.dispatchAction({ type: "showTip", ...target });
    } else chart.dispatchAction({ type: "hideTip" });
  }, [ready, active, instance]);

  return (
    <>
      {!drawn && (
        <div className="kzc-skeleton" aria-hidden>
          {[0.55, 0.8, 0.45, 0.95, 0.7, 0.6].map((h, i) => (
            <i key={i} style={{ height: `${h * 100}%` }} />
          ))}
        </div>
      )}
      <div ref={ref} className="kzc-host" data-pending={drawn ? undefined : ""} aria-hidden />
    </>
  );
}
