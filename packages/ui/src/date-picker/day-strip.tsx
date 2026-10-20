// Client. The days ahead as a strip that scrolls sideways — the agenda of the next two weeks, a delivery day, a
// session. A radio group: one tab stop, the arrows move and pick (Home / End: the first and last day), each day named by
// its full date; a marked day (it has something) says so in its name. The buttons at the ends page by a screen.
import { formatDate, getDateTimeFormat } from "@krizaka/intl";
import * as React from "react";

import { ChevronGlyph } from "../glyphs";
import { useControllable, usePrefersReducedMotion } from "../media";
import { tv } from "../tv";
import { addDays, type IsoDate, toIsoDate, toLocalDate } from "./calendar";

export const dayStrip = tv({
  slots: {
    root: "flex w-full min-w-0 flex-col gap-2",
    header: "flex items-center justify-between gap-2",
    title: "text-sm font-semibold capitalize text-fg",
    navs: "flex gap-1.5",
    nav:
      "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border-subtle bg-surface-2 bg-sheen text-fg-secondary inset-shadow-edge " +
      "transition-colors hover:border-border-strong hover:text-fg focus-visible:outline-hidden focus-visible:focus-ring disabled:pointer-events-none disabled:opacity-35",
    track:
      "-mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto overflow-y-hidden scroll-smooth px-1 py-1.5 [scrollbar-width:none] motion-reduce:scroll-auto [&::-webkit-scrollbar]:hidden",
    day:
      "relative flex h-[4.5rem] w-14 shrink-0 snap-start flex-col items-center justify-center gap-0.5 rounded-2xl border border-border-default bg-surface-2 bg-sheen text-fg inset-shadow-edge " +
      "transition-[background-color,border-color,box-shadow,transform] duration-150 hover:border-border-strong active:scale-95 " +
      "motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:outline-hidden focus-visible:focus-ring " +
      "aria-checked:border-transparent aria-checked:bg-accent aria-checked:bg-fill-shade aria-checked:text-on-accent aria-checked:shadow-glow aria-checked:inset-shadow-edge-fill " +
      "disabled:cursor-not-allowed disabled:border-dashed disabled:bg-transparent disabled:bg-none disabled:text-fg-muted disabled:shadow-none",
    weekday: "text-[11px] font-semibold uppercase tracking-wider text-fg-secondary group-aria-checked:text-on-accent group-disabled:text-fg-muted",
    number: "text-lg font-semibold tabular-nums leading-none",
    // Today: the node of the marks above the number; a marked day: a dot under it.
    node: "absolute top-1.5 h-1 w-1 rotate-45 rounded-[1px] bg-accent group-aria-checked:bg-on-accent",
    mark: "h-1.5 w-1.5 rounded-full bg-fg-secondary group-aria-checked:bg-on-accent",
    noMark: "h-1.5 w-1.5",
  },
});

export type DayStripLabels = {
  /** The button that shows the earlier days ("Earlier days"). */
  previous: string;
  /** The button that shows the later days ("Later days"). */
  next: string;
  /** Added to the name of a marked day ("has events"). */
  marked: string;
};

export const dayStripLabels: DayStripLabels = { previous: "Earlier days", next: "Later days", marked: "has events" };

export type DayStripProps = {
  /** The group's accessible name ("Delivery day"), passed translated. */
  label: string;
  /** The BCP 47 locale of the names and the dates: always explicit. */
  locale: string;
  /** The chosen day, ISO (controlled); `null` for none. */
  value?: IsoDate | null;
  /** The chosen day at first, uncontrolled. */
  defaultValue?: IsoDate | null;
  /** Called with the day picked. */
  onValueChange?: (value: IsoDate) => void;
  /** The first day of the strip. Default: today. */
  start?: IsoDate;
  /** How many days. Default 14. */
  days?: number;
  /** Refuses some days (closed, full): drawn dashed, skipped by the arrows. */
  isDateDisabled?: (date: IsoDate) => boolean;
  /** Marks the days that have something (a session, an event): a dot, and `labels.marked` in their name. */
  isDateMarked?: (date: IsoDate) => boolean;
  /** Today (marked by the node): inject it for a stable render or a test. Default: the device's date. */
  today?: IsoDate;
  /** Shows the month of the chosen day (or of the first) and the page buttons above the strip. */
  showHeader?: boolean;
  /** The words, passed translated; English by default. */
  labels?: Partial<DayStripLabels>;
  /** Classes merged on the root. */
  className?: string;
};

/** The days ahead in a row that scrolls sideways: one picked, today and the marked days shown. */
export function DayStrip({ label, locale, value: valueProp, defaultValue = null, onValueChange, start, days = 14, isDateDisabled, isDateMarked, today: todayProp, showHeader = true, labels: given, className }: DayStripProps) {
  const labels = { ...dayStripLabels, ...given };
  const s = dayStrip();
  const today = todayProp ?? toIsoDate(new Date());
  const first = start ?? today;
  const list = React.useMemo(() => Array.from({ length: days }, (_, i) => addDays(first, i)), [first, days]);
  const [value, setValue] = useControllable<IsoDate | null>(valueProp, defaultValue, (v) => v && onValueChange?.(v));
  const enabled = list.filter((d) => !isDateDisabled?.(d));
  const tabStop = value && enabled.includes(value) ? value : enabled[0];
  const track = React.useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const weekday = getDateTimeFormat(locale, { weekday: "short" });
  const monthTitle = getDateTimeFormat(locale, { month: "long", year: "numeric" }).format(toLocalDate(value ?? first));

  // A day is brought into view by scrolling the strip sideways — never with scrollIntoView, which also scrolls the page
  // (a strip low on a page would pull the whole page down to it when it appears).
  const scrollTrackTo = (el: HTMLElement, where: "center" | "nearest", smooth: boolean) => {
    const strip = track.current;
    if (!strip) return;
    const box = el.getBoundingClientRect();
    const frame = strip.getBoundingClientRect();
    const offset = box.left - frame.left;
    let left = strip.scrollLeft;
    if (where === "center") left += offset - (strip.clientWidth - box.width) / 2;
    else if (offset < 0) left += offset;
    else if (offset + box.width > strip.clientWidth) left += offset + box.width - strip.clientWidth;
    if (left === strip.scrollLeft) return;
    if (typeof strip.scrollTo === "function") strip.scrollTo({ left, behavior: smooth ? "smooth" : "auto" });
    else strip.scrollLeft = left;
  };
  const reveal = (iso: IsoDate, focus: boolean) => {
    const el = track.current?.querySelector<HTMLButtonElement>(`[data-date="${iso}"]`);
    if (!el) return;
    if (focus) el.focus({ preventScroll: true });
    scrollTrackTo(el, "nearest", !reduce);
  };
  // The chosen day is in view when the strip appears.
  React.useEffect(() => {
    const el = value ? track.current?.querySelector<HTMLElement>(`[data-date="${value}"]`) : null;
    if (el) scrollTrackTo(el, "center", false);
    // Only once: afterwards the person scrolls.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onKeyDown = (event: React.KeyboardEvent) => {
    const i = enabled.indexOf(tabStop ?? "");
    const moves: Record<string, number> = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: enabled.length - 1 };
    const to = moves[event.key];
    if (to === undefined) return;
    event.preventDefault();
    const next = enabled[Math.min(enabled.length - 1, Math.max(0, to))];
    if (!next) return;
    setValue(next);
    reveal(next, true);
  };
  const page = (by: number) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy?.({ left: by * el.clientWidth * 0.8, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div className={s.root({ className })}>
      {showHeader ? (
        <div className={s.header()}>
          <span className={s.title()} aria-hidden>
            {monthTitle}
          </span>
          <span className={s.navs()}>
            <button type="button" className={s.nav()} aria-label={labels.previous} onClick={() => page(-1)}>
              <ChevronGlyph direction="left" className="h-4 w-4" />
            </button>
            <button type="button" className={s.nav()} aria-label={labels.next} onClick={() => page(1)}>
              <ChevronGlyph direction="right" className="h-4 w-4" />
            </button>
          </span>
        </div>
      ) : null}
      <div ref={track} role="radiogroup" aria-label={label} className={s.track()} onKeyDown={onKeyDown}>
        {list.map((iso) => {
          const marked = Boolean(isDateMarked?.(iso));
          const name = formatDate(toLocalDate(iso), { locale, style: "long" });
          return (
            <button
              key={iso}
              type="button"
              role="radio"
              data-date={iso}
              aria-checked={iso === value}
              aria-current={iso === today ? "date" : undefined}
              aria-label={marked ? `${name}, ${labels.marked}` : name}
              tabIndex={iso === tabStop ? 0 : -1}
              disabled={Boolean(isDateDisabled?.(iso))}
              className={s.day({ className: "group" })}
              onClick={() => setValue(iso)}
            >
              {iso === today ? <span aria-hidden className={s.node()} /> : null}
              <span aria-hidden className={s.weekday()}>
                {weekday.format(toLocalDate(iso)).replace(/\.$/, "")}
              </span>
              <span aria-hidden className={s.number()}>
                {Number(iso.slice(8))}
              </span>
              <span aria-hidden className={marked ? s.mark() : s.noMark()} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
