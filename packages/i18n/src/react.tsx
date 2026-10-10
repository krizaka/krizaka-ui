import { createContext, type ReactNode, useContext, useMemo } from "react";

import { createTranslator, type I18n } from "./create";
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

/**
 * The locales of an app without its catalogues: what the client needs when the server hands it only the active
 * catalogue (`<I18nProvider messages>`), so no `messages/*.json` lands in the client bundle.
 */
export interface I18nLocales<L extends string> {
  readonly locales: readonly L[];
  readonly defaultLocale: L;
}

export interface I18nProviderProps<D extends Dictionary, L extends string> {
  locale: L;
  /**
   * The catalogue of the active locale, resolved on the server (`i18n.getDictionary(locale)`) and passed down: the
   * client then ships one language, not all of them. Required when the React side was created from `I18nLocales`;
   * optional over a full engine (its catalogue of `locale` is used by default).
   */
  messages?: D;
  /** How the app switches locale (push a route, write a cookie). */
  setLocale?: (locale: L) => void;
  children?: ReactNode;
}

const noop = (): void => {};

const isEngine = <D extends Dictionary, L extends string>(source: I18n<D, L> | I18nLocales<L>): source is I18n<D, L> =>
  typeof (source as Partial<I18n<D, L>>).getDictionary === "function";

/**
 * The React side of an i18n engine, bound to it once in the app:
 *
 * ```tsx
 * "use client";
 * export const { I18nProvider, useI18n } = createI18nReact(i18n);
 * ```
 *
 * `I18nProvider` takes the locale the server resolved (and how to switch it); `useI18n()` gives the active locale, its
 * catalogue, its translator and `format`. Server Components do not use the context: they call
 * `i18n.getDictionary(locale)` / `i18n.translator(locale)`.
 *
 * To ship only the active language to the browser, create it from the locales alone and let the server pass the
 * catalogue:
 *
 * ```tsx
 * "use client";
 * export const { I18nProvider, useI18n } = createI18nReact<typeof en, Locale>({ locales: ["en", "fr"], defaultLocale: "en" });
 * // layout (server): <I18nProvider locale={locale} messages={i18n.getDictionary(locale)}>
 * ```
 *
 * Outside a provider, `useI18n()` reads the engine's default locale — or throws when there is no engine to read.
 */
export function createI18nReact<D extends Dictionary, L extends string>(source: I18n<D, L> | I18nLocales<L>) {
  const engine = isEngine(source) ? source : undefined;
  const asLocale = (value: unknown): L =>
    engine ? engine.asLocale(value) : source.locales.includes(value as L) ? (value as L) : source.defaultLocale;

  const valueOf = (locale: L, setLocale: (locale: L) => void, messages?: D): I18nContextValue<D, L> => {
    if (messages) {
      // A missing key falls back to the default catalogue when the engine has it, then to the key.
      const fallback = engine && locale !== engine.defaultLocale ? engine.getDictionary(engine.defaultLocale) : undefined;
      return { locale, messages, t: createTranslator(locale, messages, fallback), format, setLocale };
    }
    if (!engine) {
      throw new Error("@krizaka/i18n/react: <I18nProvider> needs `messages` (the active catalogue) — it was created from the locales alone.");
    }
    return { locale, messages: engine.getDictionary(locale), t: engine.translator(locale), format, setLocale };
  };

  const Context = createContext<I18nContextValue<D, L> | null>(engine ? valueOf(engine.defaultLocale, noop) : null);
  Context.displayName = "I18nContext";

  function I18nProvider({ locale, messages, setLocale = noop, children }: I18nProviderProps<D, L>) {
    const current = asLocale(locale);
    const value = useMemo(() => valueOf(current, setLocale, messages), [current, setLocale, messages]);
    return <Context.Provider value={value}>{children}</Context.Provider>;
  }

  function useI18n(): I18nContextValue<D, L> {
    const value = useContext(Context);
    if (!value) throw new Error("@krizaka/i18n/react: useI18n() must be used inside <I18nProvider>.");
    return value;
  }

  return { I18nProvider, useI18n, I18nContext: Context };
}
