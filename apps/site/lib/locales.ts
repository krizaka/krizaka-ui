/* The locales, without the catalogues: client code imports these without pulling messages/*.json into its bundle (the
   active catalogue comes from the server, see I18nProvider). English is served at /, French under /fr (lib/urls.ts). */

export type Locale = "fr" | "en";
export const LOCALES: readonly Locale[] = ["en", "fr"];
export const isLocale = (value: string | undefined): value is Locale => LOCALES.includes(value as Locale);
