import { createI18n } from "@krizaka/i18n";
import en from "@/messages/en.json";
import fr from "@/messages/fr.json";

export type Locale = "en" | "fr";
export type Messages = typeof en;

// The type arguments make fr.json type-check against en.json (README of @krizaka/i18n).
export const i18n = createI18n<Messages, Locale>({ en, fr }, { defaultLocale: "en" });
export const { getDictionary, t } = i18n;
