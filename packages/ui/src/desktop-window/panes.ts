// Pure: the arithmetic of the resizable panes, so it is tested without a pointer.

export interface PaneLimits {
  min: number;
  max: number;
}

export const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), Math.max(min, max));

/**
 * The most a pane may take: its own maximum, and what leaves the content its minimum beside the other open pane and the
 * two separators. A window that is too small for both gives the content priority, down to the pane's own minimum.
 */
export function paneMax(limits: PaneLimits, windowWidth: number, otherOpenWidth: number, contentMin: number, separators: number): number {
  return Math.max(limits.min, Math.min(limits.max, windowWidth - otherOpenWidth - contentMin - separators));
}

/** The size after a drag of `delta` px along the reading direction (`direction` 1 in LTR, -1 in RTL; `side` 1 for the start pane, -1 for the end one). */
export function dragged(start: number, delta: number, direction: 1 | -1, side: 1 | -1, limits: PaneLimits, ceiling = limits.max): number {
  return clamp(start + delta * direction * side, limits.min, ceiling);
}

/** The size after an arrow key: the arrow that points away from the pane's edge grows it (→ for the start pane in LTR). `null` for another key. */
export function keyed(key: string, current: number, direction: 1 | -1, side: 1 | -1, limits: PaneLimits, shift: boolean, ceiling = limits.max): number | null {
  const step = shift ? 64 : 16;
  if (key === "Home") return limits.min;
  if (key === "End") return Math.max(limits.min, ceiling);
  if (key !== "ArrowLeft" && key !== "ArrowRight") return null;
  const toward = key === "ArrowRight" ? 1 : -1;
  return clamp(current + step * toward * direction * side, limits.min, ceiling);
}
