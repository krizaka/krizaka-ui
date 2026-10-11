"use client";
// Live data — a job queue's throughput, an auction's bids — as a sliding window: append points as they arrive, keep
// the last `size`. Pass the window to a chart with `live`: no entrance replayed on each update, no announcement of
// every point (the reader asks for it with the keyboard).
import { useCallback, useState } from "react";

export interface SlidingWindow<T> {
  /** The points in the window, oldest first. */
  readonly data: readonly T[];
  /** Appends one point or several; the oldest fall out past `size`. */
  readonly push: (...points: T[]) => void;
  /** Replaces the whole window (a reconnection, a new period). */
  readonly reset: (points?: readonly T[]) => void;
}

export function useSlidingWindow<T>(size: number, initial: readonly T[] = []): SlidingWindow<T> {
  const [data, setData] = useState<readonly T[]>(() => initial.slice(-size));
  const push = useCallback((...points: T[]) => setData((current) => [...current, ...points].slice(-size)), [size]);
  const reset = useCallback((points: readonly T[] = []) => setData(points.slice(-size)), [size]);
  return { data, push, reset };
}
