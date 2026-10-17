"use client";

import { format } from "@krizaka/i18n";
import type { CSSProperties, MouseEvent } from "react";

import type { CatalogFamily } from "@/lib/ui-catalog";

import { useI18n } from "../I18nProvider";
import { LazyExample } from "./LazyExample";

/* The families of the catalogue as cards: each cover a live example of one of its components laid out at its real size
   and scaled in, its counts read from the registry; the whole card is the family's link (the name's link stretches over
   it, the cover is inert). On /components a click filters the list; on the home it leads there. */
export function FamilyCards({ families, titles, hrefs, current, onSelect }: { families: CatalogFamily[]; titles: Record<string, string>; hrefs: Record<string, string>; current?: string; onSelect?: (key: string, event: MouseEvent<HTMLAnchorElement>) => void }) {
  const { t } = useI18n();
  const c = t.docs.ia.catalog.families;
  return (
    <ul className="kz-families-grid">
      {families.map((family, index) => (
        <li key={family.key} className="kz-family" data-current={current === family.key ? "" : undefined} style={{ "--i": index, "--kz-family-scale": family.cover?.scale ?? 0.5 } as CSSProperties}>
          <span className="kz-family-thumb" aria-hidden inert>
            {family.cover ? (
              <span className="kz-family-stage">
                <LazyExample exampleKey={family.cover.key} heavy={family.cover.heavy} placeholder={<span className="kz-catalog-placeholder" />} />
              </span>
            ) : null}
          </span>
          <span className="kz-family-text">
            <a href={hrefs[family.key]} aria-current={current === family.key ? "true" : undefined} onClick={onSelect ? (event) => onSelect(family.key, event) : undefined}>
              {titles[family.key]}
            </a>
            <span>
              {format(family.components === 1 ? c.component : c.components, { count: family.components })} · {format(c.examples, { count: family.examples })}
            </span>
            {family.mobile > 0 && <span className="kz-family-mobile">{format(c.mobile, { count: family.mobile })}</span>}
          </span>
        </li>
      ))}
    </ul>
  );
}
