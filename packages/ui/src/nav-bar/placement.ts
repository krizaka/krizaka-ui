/**
 * Where a menu panel of the bar sits: its left edge under its trigger's, pushed back inside the page when it would run
 * past the right edge, never closer to the left edge than the gutter. All values are pixels of the page (a bounding
 * rect's `left`, a width), the result is the panel's `left` relative to the bar's navigation (`root`). Pure, so a
 * viewport of 360 px and one of 1280 px are tested without a browser.
 */
export interface PlacePanel {
  /** The trigger's left edge. */
  trigger: number;
  /** The navigation's left edge (the panel is positioned inside it). */
  root: number;
  /** The panel's width. */
  panel: number;
  /** The window's width. */
  window: number;
  /**
   * The space kept between the panel and the window's edges.
   * @default 16
   */
  gutter?: number;
}

export function placePanel({ trigger, root, panel, window, gutter = 16 }: PlacePanel): number {
  const wanted = trigger - root;
  const farthest = window - gutter - panel - root;
  const nearest = gutter - root;
  return Math.round(Math.max(nearest, Math.min(wanted, farthest)));
}
