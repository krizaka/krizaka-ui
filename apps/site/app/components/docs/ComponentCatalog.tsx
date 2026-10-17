import { format, getDictionary, type Locale } from "@/lib/i18n";
import { catalogEntries, catalogFamilies } from "@/lib/ui-catalog";
import { FILTER_KEYS } from "@/lib/ui-ia";
import { USAGE } from "@/lib/ui-inventory";

import { UiCatalog } from "./UiCatalog";

/* The one list of Krizaka components — web, mobile or both — generated from the @krizaka/ui registry: placed by what each
   does (lib/ui-ia.ts), with why it is there (lib/ui-inventory.ts), a preview on every card, filtered by platform, group,
   status and the product that uses it. Rendered on /docs/ui (`<ComponentCatalog />` in content/docs/ui/index.mdx). Server
   Component: the filter and the lazy previews are the client part. */
export function ComponentCatalog({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).docs.ia;
  const entries = catalogEntries(locale, (name) => format(t.catalog.preview, { name }));
  return <UiCatalog entries={entries} families={catalogFamilies(entries, FILTER_KEYS)} usageDate={USAGE.scannedAt} />;
}
