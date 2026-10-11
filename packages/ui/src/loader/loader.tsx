// Client (timers). The whole life of a wait, done right once: nothing for the first instants (a fast answer never
// flashes a spinner), then the Krizaka glyph with its words and an ETA, held long enough to be read, ending on a
// check or a cross that is drawn and announced. `LoadingRegion` hands a region over from its content to a skeleton of
// the same shape, then to words when the wait grows long, then back to the content.
import * as React from "react";
import type { VariantProps } from "tailwind-variants";

import { LoaderGlyph } from "../spinner/glyph";
import { tv } from "../tv";

export const loader = tv({
  slots: {
    root: "text-fg-secondary",
    box: "kz-fade flex items-center gap-3",
    glyph: "shrink-0 text-accent",
    text: "flex min-w-0 flex-col",
    label: "font-medium text-fg",
    detail: "text-xs text-fg-secondary tabular-nums",
  },
  variants: {
    variant: {
      inline: { box: "text-sm", glyph: "h-5 w-5" },
      block: { box: "flex-col justify-center py-10 text-center text-sm", glyph: "h-9 w-9", text: "items-center" },
      overlay: {
        root: "absolute inset-0 z-10 flex items-center justify-center rounded-[inherit] empty:hidden",
        box: "flex-col rounded-xl border border-border-default bg-surface-1/90 px-6 py-5 text-center text-sm shadow-lg backdrop-blur-sm",
        glyph: "h-9 w-9",
        text: "items-center",
      },
      page: {
        root: "fixed inset-0 z-50 flex items-center justify-center bg-surface-0/80 backdrop-blur-sm empty:hidden",
        box: "flex-col text-center",
        glyph: "h-14 w-14",
        text: "items-center",
        label: "font-display text-lg",
      },
    },
    ended: {
      success: { glyph: "text-fg-success" },
      error: { glyph: "text-fg-danger" },
    },
  },
  defaultVariants: { variant: "inline" },
});

export type LoaderVariants = VariantProps<typeof loader>;

/**
 * `true` once `active` has lasted `delay` ms; then stays `true` at least `minDuration` ms — a wait that ends early never
 * shows, one that shows never blinks.
 */
export function useDelayedWait(active: boolean, delay = 250, minDuration = 600): boolean {
  const [shown, setShown] = React.useState(false);
  const since = React.useRef(0);
  React.useEffect(() => {
    if (active === shown) return;
    const wait = active ? delay : Math.max(0, minDuration - (Date.now() - since.current));
    const timer = setTimeout(() => {
      since.current = Date.now();
      setShown(active);
    }, wait);
    return () => clearTimeout(timer);
  }, [active, shown, delay, minDuration]);
  return shown;
}

export interface LoaderProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** What is loading, in words (“Loading your invoices”) — passed translated; shown and announced. */
  label: string;
  /**
   * loading · success · error. When the wait ends, the loader shows how it ended for `endDuration` ms, then disappears.
   * @default "loading"
   */
  status?: "loading" | "success" | "error";
  /** The words of a success (“Invoices loaded”) — passed translated. Default: nothing more than the check. */
  successLabel?: string;
  /** The words of a failure (“Could not load the invoices”) — passed translated. */
  errorLabel?: string;
  /** Between 0 and 1: a determinate wait — the trace grows to it and the percentage shows. */
  value?: number | null;
  /** The time left, in words (“About 20 s left”) — passed translated (`@krizaka/intl` formats durations). */
  eta?: string;
  /**
   * Milliseconds before anything shows: a wait shorter than this never flashes.
   * @default 250
   */
  delay?: number;
  /**
   * Once shown, the least milliseconds it stays: it never blinks.
   * @default 600
   */
  minDuration?: number;
  /**
   * Milliseconds the ending (check or cross) stays before the loader disappears; `0` never shows it, `Infinity` keeps it.
   * @default 1600
   */
  endDuration?: number;
  /**
   * inline (beside the content) · block (a region's centre) · overlay (over a `relative` parent, frosted) · page (the
   * whole screen).
   * @default "inline"
   */
  variant?: LoaderVariants["variant"];
}

/**
 * A wait, from start to end. `role="status"` (polite): its words are announced when it shows and when it ends. Under
 * prefers-reduced-motion the glyph rests on a still frame; the delay and the ending stay.
 */
export function Loader({
  label,
  status = "loading",
  successLabel,
  errorLabel,
  value,
  eta,
  delay = 250,
  minDuration = 600,
  endDuration = 1600,
  variant,
  className,
  ...props
}: LoaderProps) {
  const waiting = useDelayedWait(status === "loading", delay, minDuration);
  // Rendered already ended (a result to show), it shows its ending; otherwise only a wait that was seen ends visibly.
  const [ending, setEnding] = React.useState<"success" | "error" | null>(() => (status !== "loading" && endDuration > 0 ? status : null));
  const wasWaiting = React.useRef(false);
  React.useEffect(() => {
    if (!Number.isFinite(endDuration)) return;
    const hide = setTimeout(() => setEnding((e) => (wasWaiting.current ? e : null)), endDuration);
    return () => clearTimeout(hide);
    // Only the ending a loader was mounted with: later endings have their own timer below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  React.useEffect(() => {
    if (waiting) {
      wasWaiting.current = true;
      return;
    }
    if (!wasWaiting.current || status === "loading") return;
    wasWaiting.current = false;
    const end = status;
    const show = setTimeout(() => setEnding(endDuration > 0 ? end : null), 0);
    const hide = Number.isFinite(endDuration) ? setTimeout(() => setEnding(null), endDuration) : undefined;
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [waiting, status, endDuration]);

  const phase = waiting ? "loading" : ending;
  const s = loader({ variant, ended: phase === "success" || phase === "error" ? phase : undefined });
  const known = phase === "loading" && typeof value === "number" && Number.isFinite(value);
  const words = phase === "success" ? (successLabel ?? label) : phase === "error" ? (errorLabel ?? label) : label;
  const detail = phase === "loading" ? [known ? `${Math.round(Math.min(1, Math.max(0, value)) * 100)} %` : null, eta].filter(Boolean).join(" · ") : "";
  return (
    <div role="status" aria-live="polite" data-phase={phase ?? "idle"} className={s.root({ className })} {...props}>
      {phase && (
        <div className={s.box()}>
          <LoaderGlyph state={phase} value={known ? value : null} className={s.glyph()} />
          <span className={s.text()}>
            <span className={s.label()}>{words}</span>
            {detail && <span className={s.detail()}>{detail}</span>}
          </span>
        </div>
      )}
    </div>
  );
}

export interface LoadingRegionProps extends React.ComponentProps<"div"> {
  /** Whether the content is on its way. */
  loading: boolean;
  /** What stands in while it loads: skeletons the shape of the content (no layout shift when it arrives). */
  skeleton: React.ReactNode;
  /** What is loading, in words — passed translated; announced when the wait shows. */
  label: string;
  /** The words when the wait grows long (“Still loading — the server is busy”) — passed translated. */
  slowLabel?: string;
  /**
   * Milliseconds of skeleton before the words of a long wait appear over it.
   * @default 4000
   */
  slowAfter?: number;
  /**
   * Milliseconds before the skeleton shows: a fast answer goes straight to the content.
   * @default 200
   */
  delay?: number;
  /**
   * Once shown, the least milliseconds the skeleton stays.
   * @default 500
   */
  minDuration?: number;
}

/**
 * A region that hands over: its content → (after `delay`) a skeleton of the same shape → (after `slowAfter`) words over
 * the skeleton → its content again, fading in. `aria-busy` while it waits; the wait is announced once.
 */
export function LoadingRegion({
  loading,
  skeleton,
  label,
  slowLabel,
  slowAfter = 4000,
  delay = 200,
  minDuration = 500,
  className,
  children,
  ...props
}: LoadingRegionProps) {
  const waiting = useDelayedWait(loading, delay, minDuration);
  const slow = useDelayedWait(waiting && loading, slowAfter, 0);
  const busy = loading || waiting;
  return (
    <div aria-busy={busy} data-phase={waiting ? (slow ? "slow" : "skeleton") : busy ? "pending" : "ready"} className={["relative", className].filter(Boolean).join(" ")} {...props}>
      <span role="status" className="sr-only">
        {waiting ? (slow ? (slowLabel ?? label) : label) : ""}
      </span>
      {waiting ? (
        <div aria-hidden className="kz-fade">
          {skeleton}
        </div>
      ) : busy ? (
        // Within the delay: the skeleton holds the place, invisible — nothing flashes, nothing jumps.
        <div aria-hidden className="invisible">
          {skeleton}
        </div>
      ) : (
        <div className="kz-fade">{children}</div>
      )}
      {waiting && slow && <Loader label={slowLabel ?? label} variant="overlay" delay={0} minDuration={0} endDuration={0} aria-live="off" role="presentation" />}
    </div>
  );
}
