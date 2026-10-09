// Compiled against the built package (`pnpm publint`): what an app sees once installed from npm.
import { createI18n, format } from "../../dist/index.js";
import { createI18nReact } from "../../dist/react.js";
import { Rich } from "../../dist/rich.js";

const en = { home: { title: "Home", lead: "{count} items" }, bids: { one: "{count} bid", other: "{count} bids" } };
const i18n = createI18n<typeof en, "en" | "fr">({ en, fr: en }, { defaultLocale: "en" });

// The engine of `.` is accepted by `./react`: one I18n type across entries.
export const { I18nProvider, useI18n } = createI18nReact(i18n);
export const title: string = i18n.t("home.title");
export const bids: string = i18n.translator("fr")("bids", { count: 2 });
export const text: string = format("{a}", { a: 1 });
export const rich = Rich;
