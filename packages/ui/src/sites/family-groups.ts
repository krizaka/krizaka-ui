import { type OrgFacts, type SiteGroup, siteGroups, type SiteId, sites,type SiteStatus } from "./sites";

/** The registry's id of Krizaka Lab was `motion`; `@krizaka/org` says `lab`. */
const ORG_ID: Partial<Record<SiteId, string>> = { motion: "lab" };

/** The family to show, grouped in reading order: `org.family` when the host passes it, this package's registry otherwise. */
export function familyGroups(org?: Pick<OrgFacts, "family">): { group: SiteGroup; entries: FamilyItem[] }[] {
  const entries = org?.family
    ? org.family.map((e) => ({ id: e.id, name: e.name, url: e.url, group: e.group, status: e.status }))
    : sites.map((s) => ({ id: ORG_ID[s.id] ?? s.id, name: s.name, url: s.url, group: s.group, status: s.status }));
  return siteGroups.map((group) => ({ group, entries: entries.filter((e) => e.group === group) })).filter((g) => g.entries.length > 0);
}

/** The id `@krizaka/org` gives a site of this registry. */
export const orgIdOf = (id: SiteId): string => ORG_ID[id] ?? id;

type Pending = Exclude<SiteStatus, "released">;
type FamilyItem = { id: string; name: string; url: string; status: SiteStatus };

/**
 * What a column says about its status, from data: when every entry shares one status other than `released`, it is said once
 * for the column (`shared`); when they differ, the most common one is the column's and only the exceptions wear a badge.
 */
export function columnStatus(entries: readonly { id: string; status: SiteStatus }[]): { shared: Pending | null; exceptions: Map<string, Pending> } {
  const counts = new Map<SiteStatus, number>();
  for (const e of entries) counts.set(e.status, (counts.get(e.status) ?? 0) + 1);
  const common = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  const exceptions = new Map<string, Pending>();
  for (const e of entries) if (e.status !== common && e.status !== "released") exceptions.set(e.id, e.status);
  return { shared: common === null || common === "released" ? null : common, exceptions };
}
