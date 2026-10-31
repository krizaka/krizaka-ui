import { type OrgFacts, type SiteGroup, type SiteId, siteGroups, sites } from "./sites";

/** The registry's id of Krizaka Lab was `motion`; `@krizaka/org` says `lab`. */
const ORG_ID: Partial<Record<SiteId, string>> = { motion: "lab" };

/** The family to show, grouped in reading order: `org.family` when the host passes it, this package's registry otherwise. */
export function familyGroups(org?: Pick<OrgFacts, "family">): { group: SiteGroup; entries: { id: string; name: string; url: string }[] }[] {
  const entries = org?.family
    ? org.family.map((e) => ({ id: e.id, name: e.name, url: e.url, group: e.group }))
    : sites.map((s) => ({ id: ORG_ID[s.id] ?? s.id, name: s.name, url: s.url, group: s.group }));
  return siteGroups.map((group) => ({ group, entries: entries.filter((e) => e.group === group) })).filter((g) => g.entries.length > 0);
}

/** The id `@krizaka/org` gives a site of this registry. */
export const orgIdOf = (id: SiteId): string => ORG_ID[id] ?? id;
