// Shared by the data and media primitives (client): the clock format, the reduced-motion preference, the
// in-view observer, a debounced callback. Never an entry of its own.
import * as React from "react";

/** Seconds as a clock: `75` → `1:15`, `3725` → `1:02:05`. Negative or unknown values read `0:00`. */
export function formatClock(seconds: number): string {
  const s = Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0;
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const rest = String(s % 60).padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${rest}` : `${m}:${rest}`;
}

/** Clamps `value` between `min` and `max`. */
export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const REDUCE = "(prefers-reduced-motion: reduce)";
const subscribeReduce = (notify: () => void) => {
  if (typeof window === "undefined" || !window.matchMedia) return () => undefined;
  const query = window.matchMedia(REDUCE);
  query.addEventListener?.("change", notify);
  return () => query.removeEventListener?.("change", notify);
};

/** `true` when the person asked for less motion (`prefers-reduced-motion: reduce`); follows a change of the setting. */
export function usePrefersReducedMotion(): boolean {
  return React.useSyncExternalStore(
    subscribeReduce,
    () => (typeof window !== "undefined" && window.matchMedia ? window.matchMedia(REDUCE).matches : false),
    () => false,
  );
}

/** The latest value of a callback, for an effect or an event that must not re-subscribe when it changes. */
export function useLatest<T>(value: T) {
  const ref = React.useRef(value);
  React.useLayoutEffect(() => {
    ref.current = value;
  });
  return ref;
}

/** Calls `onChange(visible)` when at least `threshold` of the element enters or leaves the viewport. */
export function useInView(ref: React.RefObject<Element | null>, onChange: (visible: boolean) => void, enabled = true, threshold = 0.25) {
  const latest = useLatest(onChange);
  React.useEffect(() => {
    const element = ref.current;
    if (!enabled || !element || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => entry && latest.current(entry.isIntersecting), { threshold });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, enabled, threshold, latest]);
}

/** A value controlled by a prop when it is given, held inside otherwise; `set` calls `onChange` either way. */
export function useControllable<T>(value: T | undefined, defaultValue: T, onChange?: (next: T) => void) {
  const [inner, setInner] = React.useState(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? value : inner;
  const set = React.useCallback(
    (next: T) => {
      if (!controlled) setInner(next);
      onChange?.(next);
    },
    [controlled, onChange],
  );
  return [current, set] as const;
}

/** Starts a media element without an unhandled rejection (autoplay refused, the source replaced meanwhile). */
export function playSafely(media: HTMLMediaElement | null | undefined) {
  try {
    const started = media?.play() as Promise<void> | undefined;
    started?.catch?.(() => undefined);
  } catch {
    // Not playable here (no media support): the controls stay as they are.
  }
}
