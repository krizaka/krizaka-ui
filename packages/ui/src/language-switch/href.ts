/** A language the site speaks: its code (`fr`), its name in its own language (`Français`) and the address of the page in it. */
export interface Language {
  code: string;
  name: string;
  href: string;
}

/** The languages of the family, each named in its own language — the switch never shows “French” to a French reader. */
export const languageNames: Readonly<Record<string, string>> = {
  en: "English",
  fr: "Français",
  es: "Español",
  de: "Deutsch",
  it: "Italiano",
  pt: "Português",
};

/**
 * The same page in another language: `/fr/baux?x=1#a` → `/en/baux?x=1#a`. The first segment is the language when it is
 * one of `locales`; an address without a language prefix gets one. Query and hash are kept.
 */
export function languageHref(path: string, to: string, locales: readonly string[] = ["en", "fr"]): string {
  const splitIndex = path.search(/[?#]/);
  const pathname = splitIndex === -1 ? path : path.slice(0, splitIndex);
  const rest = splitIndex === -1 ? "" : path.slice(splitIndex);
  const segments = (pathname || "/").split("/").filter(Boolean);
  if (segments[0] && locales.includes(segments[0])) segments.shift();
  return `/${[to, ...segments].join("/")}${rest}`;
}

/** The `languages` of a switch for the page at `path`, in the order of `locales`, each named in its own language. */
export function languagesFor(path: string, locales: readonly string[] = ["en", "fr"]): Language[] {
  return locales.map((code) => ({ code, name: languageNames[code] ?? code.toUpperCase(), href: languageHref(path, code, locales) }));
}
