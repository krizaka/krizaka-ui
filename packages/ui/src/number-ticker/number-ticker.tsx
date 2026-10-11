// Client (an observer, a short count). A figure that climbs — without the faults of the usual counters: the server
// renders the final value (crawlers, screen readers, no-JS and reduced-motion readers all read it), an invisible copy
// holds its width from the first paint (no layout shift), a figure already on screen at load does not drop to 0 in
// front of the reader, the count is a bounded loop (~1 s) that stops for good, and assistive technology reads only the
// final value. On `trigger="change"` each digit rolls to its new value (a live total: tips, bids) and the change can be
// announced.
import * as React from "react";

import { cx } from "../cx";

export interface NumberTickerProps extends Omit<React.ComponentProps<"span">, "children"> {
  /** The value to show. */
  value: number;
  /** The locale of the digits and separators (`"fr"`: 1 204,5) — the app's locale. */
  locale?: string;
  /** How to write it (`{ style: "currency", currency: "EUR" }`, `{ maximumFractionDigits: 1 }`…): Intl.NumberFormat options. */
  format?: Intl.NumberFormatOptions;
  /**
   * `view`: climbs from 0 once, the first time it scrolls into view. `change`: each digit rolls to the new value
   * whenever `value` changes (a live total).
   * @default "view"
   */
  trigger?: "view" | "change";
  /**
   * Milliseconds of the climb.
   * @default 1100
   */
  duration?: number;
  /** Announce each new value politely (`trigger="change"`): a live total the reader should hear. */
  announce?: boolean;
  /**
   * Where the figure sits in the box its final width reserves.
   * @default "end"
   */
  align?: "start" | "end";
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

/** A figure that climbs into view, or rolls digit by digit to each new value. */
export function NumberTicker({ value, locale, format, trigger = "view", duration = 1100, announce, align = "end", className, ...props }: NumberTickerProps) {
  const formatter = React.useMemo(() => new Intl.NumberFormat(locale, format), [locale, format]);
  const text = formatter.format(value);
  const live = React.useRef<HTMLSpanElement>(null);
  // The previous value, kept in state (React's pattern for “adjusting state when a prop changes”): the trend of the last change.
  const [previous, setPrevious] = React.useState(value);
  const [trend, setTrend] = React.useState<"up" | "down" | undefined>(undefined);
  if (value !== previous) {
    setPrevious(value);
    setTrend(value > previous ? "up" : "down");
  }

  React.useEffect(() => {
    const el = live.current;
    if (trigger !== "view" || !el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let first = true;
    let frame = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        const wasFirst = first;
        first = false;
        if (!entry?.isIntersecting) return;
        io.disconnect();
        if (wasFirst) return; // already on screen at load: it stays, nothing drops to 0 in front of the reader
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration);
          el.textContent = formatter.format(value * easeOut(p));
          if (p < 1) frame = requestAnimationFrame(tick);
        };
        el.textContent = formatter.format(0);
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      el.textContent = formatter.format(value);
    };
  }, [trigger, value, duration, formatter]);

  return (
    <span data-align={align} data-trend={trigger === "change" ? trend : undefined} className={cx("kz-count", className)} {...props}>
      <span aria-hidden className="kz-count-ghost">
        {text}
      </span>
      {trigger === "change" ? (
        <span aria-hidden className="kz-count-roll">
          {/* Keyed from the right: when a digit is added (999 → 1,000), the units stay the units. */}
          {[...text].map((char, i, all) =>
            /\d/.test(char) ? (
              <span key={all.length - i} className="kz-count-digit" style={{ "--kz-digit": char } as React.CSSProperties}>
                <span>
                  {"0123456789".split("").map((d) => (
                    <span key={d}>{d}</span>
                  ))}
                </span>
              </span>
            ) : (
              <span key={all.length - i}>{char}</span>
            ),
          )}
        </span>
      ) : (
        <span aria-hidden ref={live}>
          {text}
        </span>
      )}
      <span className="sr-only" aria-live={announce ? "polite" : undefined}>
        {text}
      </span>
    </span>
  );
}
