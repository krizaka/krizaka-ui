import Link from "next/link";

import { format, getDictionary, type Locale } from "@/lib/i18n";
import { domainBudget, factsOf, inDomain, kb } from "@/lib/ui-domains";
import { type Domain, getRegistryItems } from "@/lib/ui-registry";
import { componentPath } from "@/lib/urls";

import { InlineCode } from "./InlineCode";

/* A domain's page (ADR-008 §7): what belongs there, the owner rule, the size budget, and its entries — stable and beta
   first, experimental last and flagged; deprecated ones are not listed (their page stays, with the replacement). The
   words are messages (docs.ia.domains), the entries and their counts come from the registry and the inventory. */
export function DomainDoc({ domain, locale }: { domain: Domain; locale: Locale }) {
  const t = getDictionary(locale);
  const words = t.docs.ia.domains[domain];
  const p = t.docs.domainPage;
  const entries = inDomain(getRegistryItems().filter((item) => item.status !== "deprecated"), domain);
  const live = entries.filter((entry) => (factsOf(entry.name)?.live ?? 0) > 0).length;
  const hasExperimental = entries.some((entry) => entry.status === "experimental");
  return (
    <>
      <dl className="kz-entry-facts not-prose">
        <div>
          <dt>{p.ownerRule}</dt>
          <dd>{words.owner}</dd>
        </div>
        <div>
          <dt>{p.budget}</dt>
          <dd>{format(p.budgetValue, { size: kb(domainBudget(domain)) })}</dd>
        </div>
      </dl>
      <h2 id="entries">{p.entries}</h2>
      <p className="kz-docs-note">{format(p.count, { count: entries.length, live })}{hasExperimental && ` ${p.experimentalNote}`}</p>
      <ul className="kz-domain-entries not-prose">
        {entries.map((entry) => {
          const facts = factsOf(entry.name);
          return (
            <li key={entry.name}>
              <Link href={componentPath(locale, entry.name)} className="kz-catalog-card-title">
                {entry.title}
              </Link>
              {entry.status !== "stable" && (
                <span className="kz-chip-meta" data-tone={entry.status}>
                  {t.docs.component.levels[entry.status]}
                </span>
              )}
              <span className="kz-catalog-card-text">
                <InlineCode text={entry.summary} />
              </span>
              {facts && facts.live > 0 && <span className="kz-domain-entry-live">{format(p.liveFiles, { count: facts.live })}</span>}
            </li>
          );
        })}
      </ul>
    </>
  );
}
