import { createI18n } from "@krizaka/i18n";

import en from "../messages/en.json";
import fr from "../messages/fr.json";

/** The languages of Krizaka's emails. English is the reference; a missing French key fails type-checking. */
export const EMAIL_LOCALES = ["en", "fr"] as const;
export type EmailLocale = (typeof EMAIL_LOCALES)[number];

export const i18n = createI18n<typeof en, EmailLocale>({ en, fr }, { defaultLocale: "en" });

/** The translator of a locale: `translator("fr")("common.footer.unsubscribe")`. */
export type EmailTranslator = ReturnType<typeof i18n.translator>;

/** The catalogues, for the tests and for `krizaka-i18n check`. */
export const catalogues = { en, fr } as const;
