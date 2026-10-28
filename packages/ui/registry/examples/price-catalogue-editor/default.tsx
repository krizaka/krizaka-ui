"use client";

import { PriceCatalogueEditor, type PriceCatalogueWords, type PricesView } from "@krizaka/ui/price-catalogue-editor";

export const words: PriceCatalogueWords = {
  edit: "Change", amount: "Amount", onQuote: "On quote", plusTaxes: "plus taxes", unit: "Unit", availability: "Availability", limits: "Limits", from: "From",
  keepsPrice: "Current subscriptions keep their price.", save: "Schedule the change", cancel: "Cancel", emptyIsQuote: "Leave empty for “on quote”.",
  scheduled: "Scheduled changes ({count})", history: "History", historyEmpty: "No change yet.", loading: "Loading…", saved: "Change scheduled.",
  historyLine: "{actor}, {at}: {before} → {after}, from {from}", scheduledLine: "from {from}",
  units: { month: "per month", once: "once" }, availabilities: { public: "Public", "founder-limited": "First customers", preparing: "In preparation" },
  limitNames: { founderCap: "First customers" },
};
const base = { currency: "CAD", versionId: "seed", effectiveFrom: "1970-01-01T00:00:00.000Z" };
export const prices: PricesView = {
  units: ["month", "once"], availabilities: ["public", "founder-limited", "preparing"],
  entries: [
    { ...base, key: "demo.pro", product: "Demo", plan: "Pro", unit: "month", amountCents: 999, availability: "public", limits: {}, upcoming: [{ versionId: "2", effectiveFrom: "2027-01-01T00:00:00.000Z", unit: "month", amountCents: 1199, availability: "public", limits: {} }] },
    { ...base, key: "demo.founder", product: "Demo", plan: "Founder", unit: "once", amountCents: 3900, availability: "founder-limited", limits: { founderCap: 50 }, upcoming: [] },
    { ...base, key: "demo.team", product: "Demo", plan: "Team", unit: "month", amountCents: null, availability: "preparing", limits: {}, upcoming: [] },
  ],
};

export default function PriceCatalogueEditorDefault() {
  return <PriceCatalogueEditor prices={prices} words={words} locale="en-CA" today="2026-10-28" onSchedule={async () => ({ ok: true })} loadHistory={async () => []} />;
}
