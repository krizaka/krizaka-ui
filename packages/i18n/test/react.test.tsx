import { renderToStaticMarkup } from "react-dom/server";

import { createI18n } from "../src";
import { createI18nReact } from "../src/react";

const en = { greeting: "Hello {name}", bids: { one: "{count} bid", other: "{count} bids" } };
const fr: typeof en = { greeting: "Bonjour {name}", bids: { one: "{count} enchère", other: "{count} enchères" } };
const i18n = createI18n<typeof en, "en" | "fr">({ en, fr }, { defaultLocale: "en" });
const { I18nProvider, useI18n, I18nContext } = createI18nReact(i18n);

type Value = ReturnType<typeof useI18n>;
let last: Value | undefined;
const keep = (value: Value) => {
  last = value;
};
function Probe({ onValue = keep }: { onValue?: (value: Value) => void }) {
  const value = useI18n();
  onValue(value);
  return (
    <p>
      {value.locale}|{value.messages.greeting}|{value.t("greeting", { name: "Ada" })}|{value.t("bids", { count: 2 })}|
      {value.format("{x}", { x: 1 })}
    </p>
  );
}

describe("createI18nReact", () => {
  it("gives the active locale, its catalogue and its translator", () => {
    expect(renderToStaticMarkup(<I18nProvider locale="fr"><Probe /></I18nProvider>)).toBe(
      "<p>fr|Bonjour {name}|Bonjour Ada|2 enchères|1</p>",
    );
  });

  it("narrows an unknown locale and passes the app's setLocale through", () => {
    const setLocale = vi.fn();
    renderToStaticMarkup(<I18nProvider locale={"de" as "en"} setLocale={setLocale}><Probe /></I18nProvider>);
    expect(last?.locale).toBe("en");
    last?.setLocale("fr");
    expect(setLocale).toHaveBeenCalledWith("fr");
  });

  it("reads the default locale outside a provider, with a no-op setLocale", () => {
    expect(renderToStaticMarkup(<Probe />)).toContain("en|Hello {name}|Hello Ada|2 bids|");
    expect(() => last?.setLocale("fr")).not.toThrow();
    renderToStaticMarkup(<I18nProvider locale="en"><Probe /></I18nProvider>);
    expect(last?.locale).toBe("en");
    expect(I18nContext.displayName).toBe("I18nContext");
  });

  it("takes the active catalogue as `messages` (over an engine: a missing key falls back to the default catalogue)", () => {
    const partial = { greeting: "Salut {name}" } as unknown as typeof en;
    expect(renderToStaticMarkup(<I18nProvider locale="fr" messages={partial}><Probe /></I18nProvider>)).toBe(
      "<p>fr|Salut {name}|Salut Ada|2 bids|1</p>",
    );
  });
});

describe("createI18nReact from the locales alone (one language shipped to the client)", () => {
  const light = createI18nReact<typeof en, "en" | "fr">({ locales: ["en", "fr"], defaultLocale: "en" });
  function LightProbe() {
    const { locale, messages, t } = light.useI18n();
    return (
      <p>
        {locale}|{messages.greeting}|{t("greeting", { name: "Ada" })}|{t("bids", { count: 1 })}|{t("bids", { count: 2 })}|
        {t("nope" as "greeting")}
      </p>
    );
  }

  it("translates with the catalogue the server passed, the plural rules of its locale, the key when unknown", () => {
    expect(renderToStaticMarkup(<light.I18nProvider locale="fr" messages={fr}><LightProbe /></light.I18nProvider>)).toBe(
      "<p>fr|Bonjour {name}|Bonjour Ada|1 enchère|2 enchères|nope</p>",
    );
  });

  it("narrows an unknown locale to the default one", () => {
    expect(renderToStaticMarkup(<light.I18nProvider locale={"de" as "en"} messages={en}><LightProbe /></light.I18nProvider>)).toContain("<p>en|");
  });

  it("refuses a provider without messages, and useI18n outside a provider", () => {
    expect(() => renderToStaticMarkup(<light.I18nProvider locale="en"><LightProbe /></light.I18nProvider>)).toThrow(/messages/);
    expect(() => renderToStaticMarkup(<LightProbe />)).toThrow(/inside <I18nProvider>/);
  });
});
