import Link from "next/link";

import { format, getDictionary, type Locale } from "@/lib/i18n";
import { CONSUMERS, domainOf, factsOf, INVENTORY_DATE, kb } from "@/lib/ui-domains";
import type { RegistryItem } from "@/lib/ui-registry";
import { domainPath } from "@/lib/urls";

const CONSUMER_NAMES: Record<(typeof CONSUMERS)[number], string> = { yomizaka: "Yomizaka", akinaza: "Akinaza", "orazaka-web-client": "Orazaka", "krizaka-com": "krizaka.com" };

/* What a reader needs to judge an entry before using it (ADR-008 §7): the domain it belongs to, its support level, its
   size against its budget, and who really imports it — the live consumers' counts of the dated inventory
   (docs/inventory/ui-usage.json). A fact the inventory lacks says so; none is invented. Server Component. */
export function EntryFacts({ item, locale }: { item: Pick<RegistryItem, "name" | "domain" | "status" | "title">; locale: Locale }) {
  const t = getDictionary(locale);
  const c = t.docs.component;
  const domain = domainOf(item);
  const facts = factsOf(item.name);
  const size = !facts || facts.sizeGzip === null ? c.domain.sizeNone : facts.budget ? format(c.domain.sizeOf, { size: kb(facts.sizeGzip), budget: kb(facts.budget) }) : format(c.domain.sizeAlone, { size: kb(facts.sizeGzip) });
  const by = facts ? CONSUMERS.flatMap((consumer) => (facts.byConsumer[consumer] ? [format(c.domain.usersBy, { name: CONSUMER_NAMES[consumer], count: facts.byConsumer[consumer]! })] : [])) : [];
  return (
    <dl className="kz-entry-facts not-prose" aria-label={c.domain.label}>
      <div>
        <dt>{c.domain.label}</dt>
        <dd>
          <Link href={domainPath(locale, domain)}>{t.docs.ia.domains[domain].title}</Link>
        </dd>
      </div>
      <div>
        <dt>{c.domain.level}</dt>
        <dd>
          <span className="kz-chip-meta" data-tone={item.status === "stable" ? undefined : item.status}>
            {c.levels[item.status]}
          </span>
        </dd>
      </div>
      <div>
        <dt>{c.domain.size}</dt>
        <dd>{size}</dd>
      </div>
      <div>
        <dt>{c.domain.users}</dt>
        <dd>
          {facts && facts.live > 0 ? format(c.domain.usersLive, { count: facts.live }) : c.domain.usersNone}
          {by.length > 0 && <span className="kz-entry-facts-by"> ({by.join(", ")})</span>}
          {facts && <span className="kz-entry-facts-date"> {format(c.domain.inventory, { date: INVENTORY_DATE })}</span>}
        </dd>
      </div>
    </dl>
  );
}
