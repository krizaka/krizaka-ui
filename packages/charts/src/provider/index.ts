/**
 * @krizaka/charts/provider — ChartsProvider (the locale, the brand and the words of every chart below it),
 * useSlidingWindow (live data), the labels and the palettes.
 */
export { type ChartKind, type ChartLabels, type ChartLabelsInput, DEFAULT_LABELS } from "../core/labels";
export { DIVERGING, HUES, ORDERS, palette, sequential } from "../core/palette";
export type * from "../core/types";
export { ChartsProvider, type ChartsProviderProps, type ChartsSettings } from "../web/context";
export { type SlidingWindow, useSlidingWindow } from "../web/realtime";
