import { createContext, type ReactNode, useContext, useMemo } from "react";

import type { I18n } from "./create";
import { format } from "./format";
import type { Dictionary, Translate } from "./types";

/** What `useI18n()` returns. */
export interface I18nContextValue<D extends Dictionary, L extends string> {
  /** The active locale. */
  locale: L;
  /** The whole catalogue of the active locale: `messages.home.title`. */
  messages: D;
  /** The translator of the active locale: `t("auction.bids", { count: 3 })`. */
  t: Translate<D>;
  /** `{placeholder}` replacement. */
  format: typeof format;
  /** Asks the app to switch locale (what it does — a route, a cookie — is the app's): a no-op unless given. */
  setLocale: (locale: L) => void;
}

export interface I18nProviderProps<L extends string> {
  locale: L;
  /** How the app switches locale (push a route, write a cookie). */
  setLocale?: (locale: L) => void;
  children?: ReactNode;
}

const noop = (): void => {};

/**
 * The React side of an i18n engine, bound to it once in the app:
 *
 * ```tsx
 * "use client";
 * export const { I18nProvider, useI18n } = createI18nReact(i18n);
 * ```
 *
 * `I18nProvider` takes the locale the server resolved (and how to switch it); `useI18n()` gives the active locale, its
 * catalogue, its translator and `format`. Outside a provider, `useI18n()` reads the default locale. Server Components
 * do not use the context: they call `i18n.getDictionary(locale)` / `i18n.translator(locale)`.
 */
export function createI18nReact<D extends Dictionary, L extends string>(i18n: I18n<D, L>) {
  const valueOf = (locale: L, setLocale: (locale: L) => void): I18nContextValue<D, L> => ({
    locale,
    messages: i18n.getDictionary(locale),
    t: i18n.translator(locale),
    format,
    setLocale,
  });

  const Context = createContext<I18nContextValue<D, L>>(valueOf(i18n.defaultLocale, noop));
  Context.displayName = "I18nContext";

  function I18nProvider({ locale, setLocale = noop, children }: I18nProviderProps<L>) {
    const current = i18n.asLocale(locale);
    const value = useMemo(() => valueOf(current, setLocale), [current, setLocale]);
    return <Context.Provider value={value}>{children}</Context.Provider>;
  }

  function useI18n(): I18nContextValue<D, L> {
    return useContext(Context);
  }

  return { I18nProvider, useI18n, I18nContext: Context };
}
