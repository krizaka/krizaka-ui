import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Money input",
  summary: "An amount in integer minor units (cents) and a currency, typed the way the locale writes it, never as a float.",
  status: "beta",
  category: "forms",
  platforms: "web",
  parity: { native: { status: "gap", issue: "krizaka/krizaka-ui#782", reason: "The native twins of PromoCodeField, MoneyInput and CopyButton are a follow-up of the coupons surfaces." }, desktop: "web" },
  whenToUse: ["For a price, a discount or a budget the app stores as cents.", "When the person may pick the currency among a short list."],
  whenNotToUse: [{ when: "For a plain number (a quantity).", use: "field" }],
  bestPractices: ["Hold the integer in your state; the field formats it by `locale` (`fr-CA` writes “12,50”).", "Pair it with `Field.Label` and `Field.Error`.", "A currency without decimals (JPY) accepts none; one with three (BHD) accepts three."],
  accessibility: {
    keyboard: [{ keys: "Type", action: "Digits and the locale's decimal mark; more decimals than the currency has are refused." }],
    notes: ["A text input with a decimal keypad on phones.", "The currency select needs `currencyLabel` as its accessible name.", "On blur the amount is rewritten grouped and padded (“1 299,00”)."],
  },
  related: ["field", "combobox"],
  web: {
    imports: ["MoneyInput", "parseMinorUnits", "formatMinorUnits"],
    examples: [
      { name: "default", title: "Fixed currency", description: "3900 cents in en-CA." },
      { name: "currencies", title: "Chosen currency", description: "fr-CA, four currencies; JPY drops the decimals." },
    ],
  },
} satisfies ComponentMeta;
