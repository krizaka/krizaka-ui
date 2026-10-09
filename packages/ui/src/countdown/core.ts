// The countdown's clock, shared by the web (`@krizaka/ui/countdown`) and native renders: no DOM import.
import { useSyncExternalStore } from "react";

// One clock for every countdown on the page: it ticks each second while someone listens.
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | null = null;

function subscribe(listener: () => void) {
  listeners.add(listener);
  timer ??= setInterval(() => listeners.forEach((l) => l()), 1000);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}

const nowSecond = () => Math.floor(Date.now() / 1000) * 1000;

/** Milliseconds left until `target` (never negative), ticking every second. `skewMs` = server clock − this clock. */
export function useCountdown(target: Date | string | number, skewMs = 0): number {
  const now = useSyncExternalStore(subscribe, nowSecond, nowSecond);
  return Math.max(0, new Date(target).getTime() - (now + skewMs));
}

/** Splits a duration into days, hours, minutes and seconds. */
export function splitDuration(ms: number): { d: number; h: number; m: number; s: number } {
  const total = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(total / 86400), h: Math.floor((total % 86400) / 3600), m: Math.floor((total % 3600) / 60), s: total % 60 };
}

/** The short unit labels, passed translated (e.g. `{ d: "d", h: "h", m: "m", s: "s" }`). */
export type CountdownUnits = { d: string; h: string; m: string; s: string };

/** The three segments shown: days, hours, minutes when there are days; else hours, minutes, seconds. */
export function countdownParts(ms: number, units: CountdownUnits): [number, string][] {
  const { d, h, m, s } = splitDuration(ms);
  return d > 0 ? [[d, units.d], [h, units.h], [m, units.m]] : [[h, units.h], [m, units.m], [s, units.s]];
}
