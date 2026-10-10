---
"@krizaka/i18n": minor
---

Ship one language to the browser. `createI18nReact({ locales, defaultLocale })` binds the React side without the
catalogues, and `<I18nProvider locale messages>` takes the active catalogue resolved on the server
(`i18n.getDictionary(locale)`); over a full engine `messages` is optional and falls back to the default catalogue.
`createTranslator(locale, messages, fallback?)` is exported from `@krizaka/i18n`. First stable release: 0.1.0.
