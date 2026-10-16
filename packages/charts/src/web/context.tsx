"use client";
// One place for what every chart of an app shares: the locale its figures are written in, the brand its palette
// leads with, and the words it says (translated once, from the app's catalogue). Each chart may still override them.
import { createContext, type ReactNode, useContext, useMemo } from "react";

import { type ChartLabels, type ChartLabelsInput, mergeLabels } from "../core/labels";
import type { BrandId, Locale } from "../core/types";

export interface ChartsSettings {
  /** The locale of every figure and date (`"fr-FR"`). Default `"en-US"`. */
  locale?: Locale;
  /**
   * The brand whose palette the charts use. Without it, a chart follows a `.brand-<id>` ancestor, else Krizaka. Set it
   * when the app loads a brand stylesheet on `:root` (`@krizaka/tokens/brands/orazaka.css`).
   */
  brand?: BrandId;
  /** The words, translated: the buttons, the states, the written summary. */
  labels?: ChartLabelsInput;
}

interface ResolvedSettings {
  readonly locale: Locale;
  readonly brand?: BrandId;
  readonly labels: ChartLabels;
  readonly raw?: ChartLabelsInput;
}

const DEFAULTS: ResolvedSettings = { locale: "en-US", labels: mergeLabels() };
const Context = createContext<ResolvedSettings>(DEFAULTS);

export interface ChartsProviderProps extends ChartsSettings {
  children: ReactNode;
}

/** Sets the locale, the brand and the words of every chart below it. */
export function ChartsProvider({ locale, brand, labels, children }: ChartsProviderProps) {
  const parent = useContext(Context);
  const value = useMemo<ResolvedSettings>(() => {
    const raw: ChartLabelsInput | undefined = labels ? { ...parent.raw, ...labels, kinds: { ...parent.raw?.kinds, ...labels.kinds } } : parent.raw;
    return { locale: locale ?? parent.locale, brand: brand ?? parent.brand, labels: mergeLabels(raw), raw };
  }, [locale, brand, labels, parent]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

/** The settings of a chart: its own props over the provider's over the defaults. */
export function useChartSettings(own: ChartsSettings): { locale: Locale; brand?: BrandId; labels: ChartLabels } {
  const shared = useContext(Context);
  return useMemo(
    () => ({ locale: own.locale ?? shared.locale, brand: own.brand ?? shared.brand, labels: own.labels ? mergeLabels(shared.raw, own.labels) : shared.labels }),
    [own.locale, own.brand, own.labels, shared],
  );
}

/**
 * What a `ChartCard` hands the chart inside it: the heading (title, insight, description) the card shows once, and the
 * extra controls (a period switch) that sit beside the chart's actions menu. A chart outside a card has none.
 */
export interface ChartCardContextValue {
  readonly title?: string;
  readonly insight?: ReactNode;
  readonly description?: ReactNode;
  readonly extra?: ReactNode;
}

const CardContext = createContext<ChartCardContextValue | null>(null);

export const ChartCardProvider = CardContext.Provider;

/** The card the chart is drawn in, or null. */
export function useChartCard(): ChartCardContextValue | null {
  return useContext(CardContext);
}
