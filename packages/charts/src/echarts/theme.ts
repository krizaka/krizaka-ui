"use client";
// The ECharts side of the theme: the --kz-* roles and the palette's variables resolved to plain colours on the chart's
// own element (a canvas has no CSS variables) — so a `.brand-<id>` ancestor, a `.theme-light` island and the
// chart's `data-brand` all apply — and the option pieces every chart shares (text, axes, grid, tooltip).
import type { EChartsCoreOption } from "echarts/core";

import { sequential } from "../core/palette";
import { resolveColor } from "../web/frame";

export interface ResolvedTheme {
  readonly text: string;
  readonly text2: string;
  readonly text3: string;
  readonly grid: string;
  readonly axis: string;
  readonly surface: string;
  readonly surface2: string;
  readonly surface3: string;
  readonly border: string;
  readonly accent: string;
  readonly success: string;
  readonly warning: string;
  readonly danger: string;
  readonly info: string;
  /** The categorical palette, slot 1 first. */
  readonly palette: readonly string[];
  /** A sequential ramp of the brand hue (5 steps, near the surface → full). */
  readonly ramp: readonly string[];
  /** The diverging poles. */
  readonly low: string;
  readonly high: string;
  readonly font: string;
}

const ROLES = {
  text: "--kz-text-primary",
  text2: "--kz-text-secondary",
  text3: "--kz-text-muted",
  grid: "--kz-border-subtle",
  axis: "--kz-border-default",
  surface: "--kz-surface-1",
  surface2: "--kz-surface-2",
  surface3: "--kz-surface-3",
  border: "--kz-border-default",
  accent: "--kz-accent",
  success: "--kz-success",
  warning: "--kz-warning",
  danger: "--kz-danger",
  info: "--kz-info",
  low: "--kzc-low",
  high: "--kzc-high",
} as const;

/** The theme as the browser resolves it on `el` (call again after a theme change). */
export function resolveTheme(el: Element): ResolvedTheme {
  const color = (name: string) => resolveColor(`var(${name})`, el);
  const roles = Object.fromEntries(Object.entries(ROLES).map(([key, name]) => [key, color(name)])) as Record<keyof typeof ROLES, string>;
  const palette = Array.from({ length: 8 }, (_, i) => color(`--kzc-${i + 1}`));
  const font = getComputedStyle(el).fontFamily || "system-ui, sans-serif";
  return { ...roles, palette, ramp: sequential(palette[0]!, roles.surface, 5), font };
}

/** The option every ECharts chart starts from: colours, text, the tooltip's surface, motion. */
export function baseOption(theme: ResolvedTheme, animate: boolean): EChartsCoreOption {
  return {
    color: [...theme.palette],
    backgroundColor: "transparent",
    textStyle: { color: theme.text2, fontFamily: theme.font, fontSize: 11 },
    animation: animate,
    animationDuration: 700,
    animationEasing: "cubicOut",
    animationDurationUpdate: 300,
    tooltip: {
      confine: true,
      backgroundColor: theme.surface2,
      borderColor: theme.border,
      borderWidth: 1,
      padding: [8, 10],
      textStyle: { color: theme.text, fontFamily: theme.font, fontSize: 12 },
      extraCssText: "border-radius:10px;box-shadow:var(--kz-shadow-lg);min-width:140px;",
    },
  };
}

/** A value axis: recessive, hairline grid, text-secondary labels. */
export function valueAxis(theme: ResolvedTheme, formatter: (v: number) => string): Record<string, unknown> {
  return {
    type: "value",
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: { lineStyle: { color: theme.grid, width: 1 } },
    axisLabel: { color: theme.text2, formatter },
  };
}

/** A category axis: a baseline in the axis colour, no ticks. */
export function categoryAxis(theme: ResolvedTheme, data: readonly string[]): Record<string, unknown> {
  return {
    type: "category",
    data,
    axisLine: { lineStyle: { color: theme.axis } },
    axisTick: { show: false },
    axisLabel: { color: theme.text2, hideOverlap: true },
    splitLine: { show: false },
  };
}

const escape = (text: string) => text.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

/** The tooltip's content in the package's markup (`kzc-tip-*`): a title, rows of key · name · value, a note. */
export function tooltipHtml(title: string | undefined, rows: readonly { label: string; value: string; color?: string }[], note?: string): string {
  const head = title ? `<p class="kzc-tip-title">${escape(title)}</p>` : "";
  const body = rows
    .map((row) => `<p class="kzc-tip-row">${row.color ? `<span class="kzc-key" style="background:${escape(row.color)}"></span>` : "<span></span>"}<span>${escape(row.label)}</span><b>${escape(row.value)}</b></p>`)
    .join("");
  return `${head}${body}${note ? `<p class="kzc-tip-note">${escape(note)}</p>` : ""}`;
}
