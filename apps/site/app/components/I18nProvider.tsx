"use client";

import { createI18nReact } from "@krizaka/i18n/react";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode,useCallback, useMemo } from "react";

import type { TranslationDictionary } from "@/lib/i18n";
import { type Locale, LOCALES } from "@/lib/locales";
import { localePath } from "@/lib/urls";

/* ─── The active catalogue, handed down by the server ───
   The locale layout resolves the dictionary (getDictionary) and passes ONLY that one to @krizaka/i18n/react, bound
   here to the locales alone: the client never bundles messages/*.json (both catalogues were ~60 kB of JavaScript on
   every page, parsed before the first paint counted — Lighthouse LCP). Text components keep reading `t` (the
   catalogue) from useI18n(); format and <Rich> stay @krizaka/i18n. */

const engine = createI18nReact<TranslationDictionary, Locale>({ locales: LOCALES, defaultLocale: "en" });

interface I18nValue {
  locale: Locale;
  /** The active catalogue: t.site.nav… */
  t: TranslationDictionary;
  setLocale: (l: Locale) => void;
  toggleLocale: () => void;
}

export function I18nProvider({ children, locale, messages }: { children: ReactNode; locale: Locale; messages: TranslationDictionary }) {
  const pathname = usePathname();
  const router = useRouter();

  // English has no prefix, French lives under /fr (lib/urls.ts): the same page in the other language. The two
  // languages have their own root layout (<html lang>), so Next.js makes the switch a full navigation.
  const setLocale = useCallback((l: Locale) => {
    const bare = (pathname ?? "/").replace(/^\/fr(?=\/|$)/, "") || "/";
    const target = localePath(l, bare);
    router.push(`${target}${window.location.hash}`);
  }, [pathname, router]);

  return (
    <engine.I18nProvider locale={locale} messages={messages} setLocale={setLocale}>
      {children}
    </engine.I18nProvider>
  );
}

/* ─── Hook: `t` is the active catalogue (t.site.nav…), as every component reads it ─── */

export function useI18n(): I18nValue {
  const { locale, messages, setLocale } = engine.useI18n();
  return useMemo(
    () => ({ locale, t: messages, setLocale, toggleLocale: () => setLocale(LOCALES.find((l) => l !== locale) ?? locale) }),
    [locale, messages, setLocale],
  );
}
