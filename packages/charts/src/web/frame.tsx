"use client";
// The frame every web chart is drawn in — where the "better than the industry" promises live, once for all of them:
// - a title (the accessible name) and a description; a written summary (min, max, trend) read by screen readers, or
//   shown (`summary="visible"`);
// - the data table, always in the page for assistive technology (visually hidden), shown by "Show data";
// - one tab stop on the plot (`role="group"`, roledescription "chart"), the arrow keys walking its points, each one
//   announced in a polite live region;
// - loading (a chart skeleton), empty and error states, at the chart's own height;
// - responsive (ResizeObserver) and SSR without layout shift: the server renders the frame, the summary, the table and
//   a placeholder of the exact height; the browser draws once it knows the width;
// - an entrance once on screen, none under reduced motion, none for live data;
// - an actions menu (⋯, the kit's DropdownMenu): view as table (the kit DataTable in a Sheet), download CSV / PNG / SVG,
//   copy the data.
import { type CSSProperties, type KeyboardEvent, lazy, type PointerEvent, type ReactNode, type RefObject, Suspense, useCallback, useId, useMemo, useRef, useState } from "react";

import type { ChartKind, ChartLabels } from "../core/labels";
import { fill } from "../core/labels";
import type { BrandId, Locale } from "../core/types";
import { type ChartsSettings, useChartCard, useChartSettings } from "./context";
import { download, fileName, serializeSvg, svgToPng, toCsv } from "./export";
import { useInView, useMounted, useWidth } from "./hooks";
import { cx } from "./parts";
import { ChartStyles } from "./styles";

const ChartActions = lazy(() => import("./actions"));

export type ExportFormat = "png" | "svg" | "csv";

/** The props every web chart takes, on top of its data. */
export interface ChartFrameProps extends ChartsSettings {
  /** What the chart shows, in a few words: its accessible name, and its heading unless `hideTitle`. Inside a `ChartCard`, the card's title is the default. */
  title?: string;
  /** One line that says what the chart shows, between the title and the chart: “100 jobs · +100 % vs last week”. */
  insight?: ReactNode;
  /** A sentence under the title: the period, the unit, the source. */
  description?: ReactNode;
  /** Visually hide the title (it stays the chart's accessible name): a card that already has its heading. */
  hideTitle?: boolean;
  /** The height of the plot in pixels. Default 280 (a sparkline: 32). */
  height?: number;
  /** The data is on its way: a skeleton of the chart, announced once. */
  loading?: boolean;
  /** The data could not be loaded: `true` says the default words, a node says yours (a retry button…). */
  error?: boolean | ReactNode;
  /** What to show when there is nothing to draw (default: the `empty` label). An `EmptyState` of @krizaka/ui fits. */
  empty?: ReactNode;
  /** The written summary: read by screen readers only (`"hidden"`, default), or shown under the chart (`"visible"`). */
  summary?: "hidden" | "visible";
  /** Your own summary instead of the generated one (still read first by screen readers). */
  summaryText?: string;
  /** “View as table” in the actions menu (the table is in the page for screen readers either way). Default true. */
  dataTable?: boolean;
  /** The downloads of the actions menu: all three by default, or the formats you want, or `false` for none. */
  exportable?: boolean | readonly ExportFormat[];
  /** The ⋯ actions menu of the kit. `false`: the former “Show data” and export buttons, drawn in line. Default true. */
  actionsMenu?: boolean;
  /** Streaming data (a job queue, an auction): no entrance on updates, no announcement of every new point. */
  live?: boolean;
  /** The id of the figure. */
  id?: string;
  /** A class on the figure (layout: margins, grid placement). */
  className?: string;
  /** Inline style on the figure (layout only: colours come from the tokens). */
  style?: CSSProperties;
}

export interface TableModel {
  /** The header of each column; the first one names the categories. */
  readonly columns: readonly string[];
  /** The rows, already written (formatted values). The first cell is the row's header. */
  readonly rows: readonly (readonly string[])[];
}

export interface PlotHandlers {
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
  onPointerMove?: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerLeave?: () => void;
  onBlur?: () => void;
}

interface FrameInternals {
  readonly kind: ChartKind;
  readonly frame: ChartFrameProps;
  readonly defaultHeight?: number;
  readonly table: TableModel;
  readonly summary: string;
  readonly isEmpty: boolean;
  /** Draws the plot at the measured width (browser only). */
  readonly children: (width: number, height: number) => ReactNode;
  readonly legend?: ReactNode;
  /** A calm line under the plot: sparse data, a caveat. */
  readonly note?: ReactNode;
  readonly tooltip?: ReactNode;
  readonly announcement?: string;
  readonly handlers?: PlotHandlers;
  /** Whether the plot has points to walk with the keyboard. */
  readonly navigable?: boolean;
  /** A canvas engine exports its own image; the SVG charts are serialised. */
  readonly exportImage?: (format: "png" | "svg") => Promise<string | null> | string | null;
  /** Draw on the server too (a sparkline of a known width). */
  readonly ssrWidth?: number;
  /** Whether something is drawn on top of the plot (an active point): dims the other marks. */
  readonly active?: boolean;
  readonly plotRef?: RefObject<HTMLDivElement | null>;
  readonly compact?: boolean;
  /** Something the chart needs is still loading (the world's countries): `data-pending` until it is there. */
  readonly pending?: boolean;
}

/** The settings of a chart (`useChartSettings` re-exported for the charts). */
export function useSettings(frame: ChartFrameProps): { locale: Locale; brand?: BrandId; labels: ChartLabels } {
  return useChartSettings(frame);
}

export function ChartFrame({
  kind,
  frame,
  defaultHeight = 280,
  table,
  summary,
  isEmpty,
  children,
  legend,
  note,
  tooltip,
  announcement,
  handlers,
  navigable = true,
  exportImage,
  ssrWidth,
  active,
  plotRef,
  compact,
  pending,
}: FrameInternals) {
  const card = useChartCard();
  const { hideTitle, height = defaultHeight, loading, error, empty, summaryText, dataTable = true, exportable, actionsMenu = true, live, id, className, style } = frame;
  const { brand, labels } = useChartSettings(frame);
  const title = frame.title ?? card?.title ?? labels.kinds[kind];
  const insight = frame.insight ?? card?.insight;
  const description = frame.description ?? card?.description;
  const uid = useId();
  const ids = { title: `${uid}-t`, summary: `${uid}-s`, hint: `${uid}-h`, table: `${uid}-d` };
  const ownRef = useRef<HTMLDivElement | null>(null);
  const ref = plotRef ?? ownRef;
  const figureRef = useRef<HTMLElement | null>(null);
  const mounted = useMounted();
  const measured = useWidth(ref);
  const width = mounted ? measured : 0;
  const inView = useInView(figureRef, { once: true });
  const [showTable, setShowTable] = useState(false);

  const [copied, setCopied] = useState(false);
  // The menu offers every download unless told otherwise; the legacy inline buttons only the ones asked for.
  const formats = useMemo<readonly ExportFormat[]>(() => {
    const all: readonly ExportFormat[] = actionsMenu ? ["csv", "png", "svg"] : ["png", "svg", "csv"];
    if (exportable === undefined) return actionsMenu ? all : [];
    return exportable === true ? all : exportable || [];
  }, [exportable, actionsMenu]);
  const state = error ? "error" : loading ? "loading" : isEmpty ? "empty" : "ready";

  const doExport = useCallback(
    async (format: ExportFormat) => {
      if (format === "csv") {
        download(fileName(title, "csv"), new Blob([`\uFEFF${toCsv([table.columns, ...table.rows])}`], { type: "text/csv;charset=utf-8" }));
        return;
      }
      if (exportImage) {
        const url = await exportImage(format);
        if (url) download(fileName(title, format), url);
        return;
      }
      const svg = ref.current?.querySelector<SVGSVGElement>("svg.kzc-svg");
      if (!svg) return;
      const background = getComputedStyle(figureRef.current ?? document.body).getPropertyValue("--kz-surface-1").trim() || "#fff";
      const surface = resolveColor(background, figureRef.current);
      const markup = serializeSvg(svg, surface);
      if (format === "svg") download(fileName(title, "svg"), new Blob([markup], { type: "image/svg+xml" }));
      else {
        const box = svg.getBoundingClientRect();
        download(fileName(title, "png"), await svgToPng(markup, box.width, box.height, surface));
      }
    },
    [exportImage, ref, table, title],
  );

  const doCopy = useCallback(async () => {
    const text = [table.columns, ...table.rows].map((row) => row.join("\t")).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }, [table]);

  const drawWidth = width || ssrWidth || 0;
  let plot: ReactNode;
  if (state === "loading") {
    plot = (
      <div className="kzc-skeleton" role="status">
        <span className="kzc-sr">{labels.loading}</span>
        {!compact && [0.55, 0.8, 0.45, 0.95, 0.7, 0.6].map((h, i) => <i key={i} aria-hidden style={{ height: `${h * 100}%` }} />)}
      </div>
    );
  } else if (state === "error") {
    plot = (
      <div className="kzc-state" data-state="error" role="alert">
        {error === true ? labels.error : error}
      </div>
    );
  } else if (state === "empty") {
    plot = empty ?? (
      <div className="kzc-state" data-state="empty" role="status">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
        </svg>
        {labels.empty}
      </div>
    );
  } else if (drawWidth > 0) {
    plot = children(drawWidth, height);
  } else {
    // SSR and the first browser pass: a placeholder of the exact height (no layout shift), the data already in the table.
    plot = !compact && (
      <div className="kzc-skeleton" aria-hidden>
        {[0.55, 0.8, 0.45, 0.95, 0.7, 0.6].map((h, i) => (
          <i key={i} style={{ height: `${h * 100}%` }} />
        ))}
      </div>
    );
  }

  const ready = state === "ready" && drawWidth > 0;
  return (
    <figure
      ref={figureRef}
      id={id}
      className={cx("kzc", className)}
      style={style}
      data-kzc=""
      data-kind={kind}
      data-state={state}
      data-brand={brand}
      data-inview={inView || undefined}
      data-live={live || undefined}
      data-active={active || undefined}
      data-pending={pending || (state === "ready" && drawWidth === 0) || undefined}
      aria-labelledby={ids.title}
    >
      <ChartStyles />
      {(() => {
        const tools = !compact && state !== "loading" && state !== "error";
        const menu = actionsMenu && tools && !isEmpty && (dataTable || formats.length > 0);
        const legacy = !actionsMenu && tools && (dataTable || formats.length > 0);
        const visible = !hideTitle || description || insight || menu || legacy || card?.extra;
        return (
          <div className={visible ? "kzc-head" : "kzc-sr"}>
            <div className="kzc-heading" data-insight={insight ? "" : undefined}>
              <p id={ids.title} className={hideTitle ? "kzc-sr" : "kzc-title"}>
                {title}
              </p>
              {insight && <p className="kzc-insight">{insight}</p>}
              {description && <p className="kzc-desc">{description}</p>}
            </div>
            {(menu || legacy || card?.extra) && (
              <div className="kzc-tools">
                {card?.extra}
                {menu && mounted && (
                  <Suspense fallback={<MoreButton label={labels.actions} />}>
                    <ChartActions title={title} table={table} labels={labels} formats={formats} viewTable={dataTable} onExport={(format) => void doExport(format)} onCopy={() => void doCopy()} />
                  </Suspense>
                )}
                {menu && !mounted && <MoreButton label={labels.actions} />}
                {legacy && !isEmpty && dataTable && (
                  <button type="button" className="kzc-btn" aria-expanded={showTable} aria-controls={ids.table} onClick={() => setShowTable((v) => !v)}>
                    {showTable ? labels.hideData : labels.showData}
                  </button>
                )}
                {legacy &&
                  !isEmpty &&
                  formats.map((format) => (
                    <button key={format} type="button" className="kzc-btn" onClick={() => void doExport(format)} aria-label={`${title} — ${format.toUpperCase()}`}>
                      {format === "png" ? labels.exportPng : format === "svg" ? labels.exportSvg : labels.exportCsv}
                    </button>
                  ))}
              </div>
            )}
          </div>
        );
      })()}
      {legend}
      <div
        ref={ref}
        className="kzc-plot"
        style={{ height }}
        {...(ready
          ? {
              role: "group",
              "aria-roledescription": labels.roleDescription,
              "aria-labelledby": ids.title,
              "aria-describedby": navigable ? `${ids.summary} ${ids.hint}` : ids.summary,
              tabIndex: navigable ? 0 : undefined,
              ...handlers,
            }
          : {})}
      >
        {plot}
        {ready && tooltip}
      </div>
      {ready && note && <p className="kzc-note">{note}</p>}
      <p id={ids.summary} className={frame.summary === "visible" ? "kzc-summary" : "kzc-sr"}>
        {summaryText ?? summary}
      </p>
      {ready && navigable && (
        <span id={ids.hint} className="kzc-sr">
          {labels.keyboardHint}
        </span>
      )}
      <div className="kzc-live" aria-live="polite" aria-atomic="true">
        {copied ? labels.copied : live ? "" : announcement}
      </div>
      {!isEmpty && (
        <div id={ids.table} className={showTable ? "kzc-table-wrap" : "kzc-sr"}>
          <table className="kzc-table">
            <caption>{fill(labels.tableCaption, { title })}</caption>
            <thead>
              <tr>
                {table.columns.map((column, i) => (
                  <th key={i} scope="col">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) =>
                    c === 0 ? (
                      <th key={c} scope="row">
                        {cell}
                      </th>
                    ) : (
                      <td key={c}>{cell}</td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </figure>
  );
}

/** The ⋯ button as the server and the first browser pass draw it, until the kit's menu has loaded. */
function MoreButton({ label }: { label: string }) {
  return (
    <button type="button" className="kzc-more" aria-label={label} disabled>
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden width="16" height="16">
        <circle cx="5" cy="12" r="1.8" />
        <circle cx="12" cy="12" r="1.8" />
        <circle cx="19" cy="12" r="1.8" />
      </svg>
    </button>
  );
}

/** A CSS colour (a `var(--…)`, `light-dark()`, `hsl()`…) as the browser resolves it on `scope`: `rgb(r, g, b)`. */
export function resolveColor(color: string, scope: Element | null): string {
  if (typeof document === "undefined") return color;
  const probe = document.createElement("span");
  probe.style.color = color;
  probe.style.display = "none";
  (scope ?? document.body).appendChild(probe);
  const resolved = getComputedStyle(probe).color;
  probe.remove();
  return resolved || color;
}
