// Server-safe. One day's agenda: the appointments in time order, the times in tabular sans figures, a « now » line
// placed between them, the past dimmed. The row is one link or button (the app's selection, its URL); its action is a
// sibling control, never nested. Words are props; the app passes `now` (null hides the line).
import * as React from "react";
import { tv } from "tailwind-variants";

export const agenda = tv({
  slots: {
    root: "m-0 flex list-none flex-col p-0",
    item: "relative flex items-stretch gap-1 border-b border-border-subtle last:border-b-0",
    main: "group flex min-w-0 flex-1 items-center gap-3 rounded-md px-2 py-3 text-left outline-none transition-colors hover:bg-surface-1 focus-visible:ring-2 focus-visible:ring-focus data-[selected=true]:bg-surface-2",
    times: "flex w-16 shrink-0 flex-col text-sm tabular-nums text-fg",
    start: "font-semibold",
    end: "text-xs text-fg-secondary",
    marker: "h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--kz-ag-tone)] ring-4 ring-surface-0",
    leading: "shrink-0",
    text: "flex min-w-0 flex-1 flex-col",
    title: "truncate text-sm font-semibold text-fg",
    description: "truncate text-xs text-fg-secondary",
    status: "shrink-0",
    action: "flex shrink-0 items-center pr-1",
    now: "relative flex items-center gap-2 py-1 text-xs font-semibold text-fg-accent",
    nowLine: "h-px flex-1 bg-accent",
    nowDot: "h-2 w-2 shrink-0 rounded-full bg-accent",
    empty: "py-6",
  },
  variants: {
    past: { true: { times: "text-fg-secondary", title: "font-medium text-fg-secondary", marker: "opacity-60" } },
  },
});

export type AgendaTone = "neutral" | "accent" | "success" | "warning" | "danger" | "info";
const TONE: Record<AgendaTone, string> = {
  neutral: "var(--kz-border-strong)",
  accent: "var(--kz-accent)",
  success: "var(--kz-success)",
  warning: "var(--kz-warning)",
  danger: "var(--kz-danger)",
  info: "var(--kz-info)",
};

export type AgendaItem = {
  id: string;
  /** ISO instant. */
  start: string;
  /** ISO instant; shown under the start and used to know which one is current. */
  end?: string;
  /** The client, the subject. */
  title: React.ReactNode;
  /** The service, the stylist: one muted line. */
  description?: React.ReactNode;
  /** The colour of the rail's dot; the status chip carries the word. */
  tone?: AgendaTone;
  /** Before the text: an `Avatar`. */
  leading?: React.ReactNode;
  /** After the text: a `Badge` with the status, in words. */
  status?: React.ReactNode;
  /** An address for the row (the app's URL state, `?appointment=…`); rendered with `linkAs`. */
  href?: string;
};

export type AgendaLabels = {
  /** The « now » line: `(time) => "Now · 10:42"`. */
  now: (time: string) => string;
};
export const agendaLabels: AgendaLabels = { now: (time) => `Now · ${time}` };

export type AgendaProps<T extends AgendaItem> = {
  items: readonly T[];
  /** The agenda's accessible name (« Appointments of Monday »). */
  "aria-label": string;
  /** The locale of the times. Default `en-US`. */
  locale?: string;
  /** The time zone of the shop, so the times read the same on the server and on the phone. */
  timeZone?: string;
  /** The instant of the « now » line; `null` or absent hides it (a day that is not today). */
  now?: Date | null;
  /** The open item: marked `aria-current`. */
  selectedId?: string | null;
  /** Called with the item pressed, for items with no `href`. */
  onSelect?: (item: T) => void;
  /** The router's link for items with an `href` (`next/link`). Default `a`. */
  linkAs?: React.ElementType;
  /** A small control after the row (Start, End), outside the row's link. */
  action?: (item: T) => React.ReactNode;
  labels?: Partial<AgendaLabels>;
  /** Shown when there is no item (an `EmptyState`). */
  empty?: React.ReactNode;
  className?: string;
};

const stamp = (value: string) => Date.parse(value);

export function Agenda<T extends AgendaItem>({ items, locale = "en-US", timeZone, now, selectedId, onSelect, linkAs, action, labels: given, empty, className, "aria-label": label }: AgendaProps<T>) {
  const labels = { ...agendaLabels, ...given };
  const s = agenda();
  const clock = new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit", timeZone });
  const time = (value: string | Date) => clock.format(typeof value === "string" ? new Date(value) : value);
  const sorted = [...items].sort((a, b) => stamp(a.start) - stamp(b.start));
  if (sorted.length === 0) return empty ? <div className={s.empty()}>{empty}</div> : null;
  const at = now ? now.getTime() : null;
  // The line goes before the first item still to come, and after the last when every one has begun.
  const upcoming = at === null ? -1 : sorted.findIndex((i) => stamp(i.start) > at);
  const lineBefore = at === null ? -1 : upcoming === -1 ? sorted.length : upcoming;
  const Link = (linkAs ?? "a") as React.ElementType;

  const row = (item: T) => {
    const begun = at !== null && stamp(item.start) <= at;
    const over = begun && item.end !== undefined && stamp(item.end) <= at!;
    const rowStyle = agenda({ past: over });
    const inner = (
      <>
        <span className={rowStyle.times()}>
          <span className={s.start()}>{time(item.start)}</span>
          {item.end ? <span className={s.end()}>{time(item.end)}</span> : null}
        </span>
        <span aria-hidden className={rowStyle.marker()} style={{ ["--kz-ag-tone" as string]: TONE[item.tone ?? "neutral"] }} />
        {item.leading ? <span className={s.leading()}>{item.leading}</span> : null}
        <span className={s.text()}>
          <span className={rowStyle.title()}>{item.title}</span>
          {item.description ? <span className={s.description()}>{item.description}</span> : null}
        </span>
        {item.status ? <span className={s.status()}>{item.status}</span> : null}
      </>
    );
    const common = { className: s.main(), "data-selected": selectedId === item.id, "data-current": begun && !over, "aria-current": selectedId === item.id ? ("true" as const) : undefined };
    return (
      <li key={item.id} className={s.item()}>
        {item.href ? (
          <Link href={item.href} {...common}>
            {inner}
          </Link>
        ) : (
          <button type="button" onClick={() => onSelect?.(item)} {...common}>
            {inner}
          </button>
        )}
        {action ? <div className={s.action()}>{action(item)}</div> : null}
      </li>
    );
  };

  const nowLine =
    at === null ? null : (
      <li key="now" className={s.now()} data-agenda-now>
        <span aria-hidden className={s.nowDot()} />
        <span>{labels.now(time(now!))}</span>
        <span aria-hidden className={s.nowLine()} />
      </li>
    );

  const rows: React.ReactNode[] = [];
  sorted.forEach((item, index) => {
    if (index === lineBefore) rows.push(nowLine);
    rows.push(row(item));
  });
  if (lineBefore === sorted.length) rows.push(nowLine);

  return (
    <ol aria-label={label} className={s.root({ className })}>
      {rows}
    </ol>
  );
}
