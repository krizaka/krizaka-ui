"use client";
// The browser facts a chart reacts to: its width (ResizeObserver), whether it is on screen (IntersectionObserver),
// the reader's motion preference, the theme, and whether it runs in the browser at all (SSR renders a placeholder).
import { type RefObject, useEffect, useState, useSyncExternalStore } from "react";

/** The element's content width, rounded; 0 until measured (on the server, before the first layout). */
export function useWidth(ref: RefObject<HTMLElement | null>): number {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const measure = () => setWidth(Math.round(el.getBoundingClientRect().width));
    measure();
    if (typeof ResizeObserver === "undefined") return undefined;
    // Coalesced to one frame: a drag of a window does not redraw the chart a hundred times.
    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    });
    observer.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [ref]);
  return width;
}

/**
 * Whether the element is on screen (with a margin): an entrance waits for it, a loop pauses outside it. `once` keeps
 * `true` after the first sight (entrances); otherwise it follows the element (loops). True where it cannot be known.
 */
export function useInView(ref: RefObject<HTMLElement | null>, { once = false, margin = "120px" } = {}): boolean {
  // Without IntersectionObserver (an old runtime, a test DOM), everything counts as on screen.
  const [inView, setInView] = useState(() => typeof window !== "undefined" && typeof IntersectionObserver === "undefined");
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = Boolean(entry?.isIntersecting);
        setInView(visible);
        if (visible && once) observer.disconnect();
      },
      { rootMargin: margin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, once, margin]);
  return inView;
}

const REDUCE = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (notify: () => void) => {
  if (typeof matchMedia === "undefined") return () => {};
  const query = matchMedia(REDUCE);
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
};

/** Whether the reader asked for reduced motion (false on the server: the CSS guards the entrances anyway). */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeMotion,
    () => typeof matchMedia !== "undefined" && matchMedia(REDUCE).matches,
    () => false,
  );
}

/** Increments on every theme change (`html` class, style or `data-theme`, and the OS scheme): canvas charts re-read their colours. */
export function useThemeVersion(): number {
  const [version, setVersion] = useState(0);
  useEffect(() => {
    const bump = () => setVersion((v) => v + 1);
    const observer = new MutationObserver(bump);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style", "data-theme"] });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class", "style", "data-theme"] });
    const query = typeof matchMedia === "undefined" ? null : matchMedia("(prefers-color-scheme: dark)");
    query?.addEventListener("change", bump);
    return () => {
      observer.disconnect();
      query?.removeEventListener("change", bump);
    };
  }, []);
  return version;
}

const noop = () => () => {};
/** False during the server render and the hydration pass, true after: what only the browser can draw waits for it. */
export function useMounted(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}
