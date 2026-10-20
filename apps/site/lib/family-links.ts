/* The home's « rest of the family »: the other open-source sites of Krizaka, then the company — read from
   @krizaka/ui/sites, the family's one list (a site added there appears here at the next build). */
import { type Site, type SiteId, sites } from "@krizaka/ui/sites";

export function familyLinks(current: SiteId): Site[] {
  return [...sites.filter((s) => s.group === "open-source" && s.id !== current), ...sites.filter((s) => s.id === "krizaka")];
}
