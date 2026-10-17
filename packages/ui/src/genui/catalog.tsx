// The base catalog of `krizaka:genui/v1` (ADR-082): layout, text, card, callout and table — what a model may draw with
// @krizaka/ui alone. `KpiStat` and `ChartCard` come from @krizaka/charts (`chartsGenUiCatalog`), which depends on this
// package, never the reverse.
import { formatCompact, formatMoney, formatNumber, formatPercent } from "@krizaka/intl";
import type * as React from "react";

import { Alert } from "../alert";
import { CardBody, CardRoot, CardTitle } from "../card";
import { DataTable, type DataTableColumn } from "../data-table";
import {
  allowKeys,
  checkBinding,
  checkChildren,
  checkCurrency,
  checkEnum,
  checkId,
  checkText,
  GENUI_FORMATS,
  GENUI_LIMITS,
  type GenUiComponent,
  type GenUiFormat,
} from "./spec";
import type { GenUiCatalog, GenUiEntry, GenUiRenderContext } from "./surface";

const first = (...problems: (string | null)[]) => problems.find((p) => p !== null) ?? null;

/** A resolved value as text — strings and numbers only; anything else is not drawn. */
function asText(value: unknown): string {
  if (typeof value === "string") return value.slice(0, GENUI_LIMITS.string);
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return "";
}

/** A number written in one of the closed formats. */
export function formatGenUiValue(value: unknown, format: GenUiFormat | undefined, locale: string, currency?: string): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return asText(value);
  switch (format) {
    case "integer":
      return formatNumber(Math.round(value), { locale, maximumFractionDigits: 0 });
    case "compact":
      return formatCompact(value, { locale });
    case "percent":
      return formatPercent(value, { locale, maximumFractionDigits: 1 });
    case "money":
      return currency ? formatMoney(Math.round(value), { currency, locale }) : formatNumber(value, { locale });
    default:
      return formatNumber(value, { locale, maximumFractionDigits: 2 });
  }
}

const TONES = ["info", "success", "warning", "danger"] as const;
const VARIANTS = ["body", "heading", "caption"] as const;

const column: GenUiEntry = {
  check: (c) => first(allowKeys(c, ["children"]), checkChildren(c.children)),
  render: (c, ctx) => <div className="flex min-w-0 flex-col gap-4">{ctx.children(c.children)}</div>,
};

const row: GenUiEntry = {
  check: (c) => first(allowKeys(c, ["children"]), checkChildren(c.children)),
  render: (c, ctx) => <div className="grid min-w-0 gap-4 [grid-template-columns:repeat(auto-fit,minmax(12rem,1fr))]">{ctx.children(c.children)}</div>,
};

const text: GenUiEntry = {
  check: (c) => first(allowKeys(c, ["text", "variant"]), checkText(c.text, "text", true), checkEnum(c.variant, "variant", VARIANTS)),
  render: (c, ctx) => {
    const value = asText(ctx.resolve(c.text));
    if (c.variant === "heading") return <h3 className="text-base font-semibold text-fg">{value}</h3>;
    if (c.variant === "caption") return <p className="text-xs text-fg-muted">{value}</p>;
    return <p className="text-sm text-fg">{value}</p>;
  },
};

const card: GenUiEntry = {
  check: (c) => first(allowKeys(c, ["title", "child"]), checkText(c.title, "title", false), c.child === undefined ? null : checkId(c.child, "child")),
  render: (c, ctx) => (
    <CardRoot>
      <CardBody>
        {c.title !== undefined && <CardTitle>{asText(ctx.resolve(c.title))}</CardTitle>}
        {c.child !== undefined && <div className="mt-3">{ctx.child(c.child)}</div>}
      </CardBody>
    </CardRoot>
  ),
};

const callout: GenUiEntry = {
  check: (c) => first(allowKeys(c, ["tone", "title", "text"]), checkEnum(c.tone, "tone", TONES), checkText(c.title, "title", false), checkText(c.text, "text", false)),
  render: (c, ctx) => (
    <Alert tone={(c.tone as (typeof TONES)[number] | undefined) ?? "info"} title={c.title === undefined ? undefined : asText(ctx.resolve(c.title))}>
      {c.text === undefined ? undefined : asText(ctx.resolve(c.text))}
    </Alert>
  ),
};

type Column = { key: string; label: string; format?: GenUiFormat; currency?: string };

function checkColumns(value: unknown): string | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > 12) return "columns is an array of 1 to 12";
  for (const raw of value) {
    if (raw === null || typeof raw !== "object" || Array.isArray(raw)) return "a column is an object";
    const col = raw as Record<string, unknown>;
    const keys = Object.keys(col).find((k) => !["key", "label", "format", "currency"].includes(k));
    if (keys) return `a column has no key "${keys}"`;
    if (typeof col.key !== "string" || !/^[A-Za-z0-9_]{1,64}$/.test(col.key)) return "a column key is 1-64 characters of [A-Za-z0-9_]";
    if (typeof col.label !== "string" || col.label.length > 120) return "a column label is a string";
    const problem = first(checkEnum(col.format, "format", GENUI_FORMATS), checkCurrency(col.currency, col.format === "money"));
    if (problem) return problem;
  }
  return null;
}

type Row = Record<string, unknown> & { __genuiRow: string };

function TableView({ c, ctx }: { c: GenUiComponent; ctx: GenUiRenderContext }) {
  const columns = c.columns as readonly Column[];
  const raw = ctx.resolve(c.rows);
  const rows: Row[] = Array.isArray(raw)
    ? raw.slice(0, GENUI_LIMITS.array).flatMap((r, i) => (r !== null && typeof r === "object" && !Array.isArray(r) ? [{ ...(r as Record<string, unknown>), __genuiRow: String(i) }] : []))
    : [];
  const cols: DataTableColumn<Row>[] = columns.map((col) => ({
    id: col.key,
    header: col.label,
    sortable: true,
    type: col.format ? "number" : "text",
    value: (r) => {
      const v = r[col.key];
      return typeof v === "number" || typeof v === "string" ? v : null;
    },
    cell: (r) => formatGenUiValue(r[col.key], col.format, ctx.locale, col.currency),
  }));
  if (rows.length === 0) return <p className="text-sm text-fg-muted">{ctx.labels.noData}</p>;
  return <DataTable rows={rows} columns={cols} getRowId={(r) => r.__genuiRow} caption={c.caption === undefined ? ctx.labels.surface : asText(ctx.resolve(c.caption))} showCaption={c.caption !== undefined} />;
}

const table: GenUiEntry = {
  check: (c) => first(allowKeys(c, ["caption", "columns", "rows"]), checkText(c.caption, "caption", false), checkColumns(c.columns), checkBinding(c.rows, "rows")),
  render: (c, ctx): React.ReactNode => <TableView c={c} ctx={ctx} />,
};

/** `Column`, `Row`, `Text`, `Card`, `Callout`, `Table` — the catalog @krizaka/ui draws on its own. */
export const baseGenUiCatalog: GenUiCatalog = { Column: column, Row: row, Text: text, Card: card, Callout: callout, Table: table };
