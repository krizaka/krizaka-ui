// Server-safe: plain data. The Krizaka family — every site Krizaka runs, once. The family switcher of the bar
// (`NavBar.Family`) and the common footer (`SiteFooter`) both read it, so adding a site is one release of this package:
// every bar and every footer of the family follow.
//
// The words of the family (a site's one line, the groups, the statuses, the footer's signature) are brand data, written
// here in English and French (`familyLabels`) — a site passes the set of its locale, or its own translation.

/** A site of the family. */
export type SiteId = "krizaka" | "orazaka" | "orochia" | "yasakia" | "yororis" | "yomizaka" | "kachizaka" | "akinaza" | "ui" | "java" | "github";

/** What a site is: the company, a product, or an open-source project. It chooses the footer's signature line. */
export type SiteKind = "company" | "product" | "open-source";

/**
 * `released`: open to visit. `upcoming`: announced, not released yet (said "Coming soon"). `construction`: under
 * construction — nothing deployed beyond its page, nothing offered. `development`: being built in the open, nothing
 * deployed yet — its address is its repository (said "In development").
 */
export type SiteStatus = "released" | "upcoming" | "construction" | "development";

/** The groups of the family, in reading order: Krizaka · Products · Open source · GitHub. */
export type SiteGroup = "krizaka" | "products" | "open-source" | "github";

/** The mark a site wears: a brand of `ProductLogo` (Krizaka UI and Krizaka Java wear Krizaka's), or GitHub's. */
export type SiteMark = "krizaka" | "orazaka" | "orochia" | "yasakia" | "yororis" | "yomizaka" | "kachizaka" | "akinaza" | "github";

export interface Site {
  readonly id: SiteId;
  /** The name, never translated. */
  readonly name: string;
  /** The address of the site (its home). */
  readonly url: string;
  /** The address without the scheme, as people say it (`ui.krizaka.com`). */
  readonly host: string;
  readonly kind: SiteKind;
  readonly group: SiteGroup;
  readonly status: SiteStatus;
  readonly mark: SiteMark;
  /** The repository the site is built from. */
  readonly repo: string;
}

const site = (s: Omit<Site, "host">): Site => ({ ...s, host: s.url.replace(/^https?:\/\//, "").replace(/\/$/, "") });

/** Every site of the family, in reading order (the group order, then the order inside each group). */
export const sites: readonly Site[] = [
  site({ id: "krizaka", name: "Krizaka", url: "https://www.krizaka.com", kind: "company", group: "krizaka", status: "released", mark: "krizaka", repo: "https://github.com/krizaka/krizaka-com" }),
  site({ id: "orazaka", name: "Orazaka", url: "https://dev.orazaka.com", kind: "product", group: "products", status: "released", mark: "orazaka", repo: "https://github.com/krizaka/orazaka" }),
  site({ id: "orochia", name: "Orochia", url: "https://dev.orochia.com", kind: "product", group: "products", status: "released", mark: "orochia", repo: "https://github.com/krizaka/orochia" }),
  site({ id: "yasakia", name: "Yasakia", url: "https://dev.yasakia.com", kind: "product", group: "products", status: "upcoming", mark: "yasakia", repo: "https://github.com/krizaka/yasakia" }),
  site({ id: "yororis", name: "Yororis", url: "https://dev.yororis.com", kind: "product", group: "products", status: "construction", mark: "yororis", repo: "https://github.com/krizaka/yororis" }),
  site({ id: "yomizaka", name: "Yomizaka", url: "https://dev.yomizaka.com", kind: "product", group: "products", status: "upcoming", mark: "yomizaka", repo: "https://github.com/krizaka/yomizaka" }),
  // In development: nothing deployed yet, so the address is the repository (never a dead link to an unborn dev site).
  site({ id: "kachizaka", name: "Kachizaka", url: "https://github.com/krizaka/kachizaka", kind: "product", group: "products", status: "development", mark: "kachizaka", repo: "https://github.com/krizaka/kachizaka" }),
  site({ id: "akinaza", name: "Akinaza", url: "https://github.com/krizaka/akinaza", kind: "product", group: "products", status: "development", mark: "akinaza", repo: "https://github.com/krizaka/akinaza" }),
  site({ id: "ui", name: "Krizaka UI", url: "https://ui.krizaka.com", kind: "open-source", group: "open-source", status: "released", mark: "krizaka", repo: "https://github.com/krizaka/krizaka-ui" }),
  site({ id: "java", name: "Krizaka Java", url: "https://java.krizaka.com", kind: "open-source", group: "open-source", status: "released", mark: "krizaka", repo: "https://github.com/krizaka/krizaka-build" }),
  site({ id: "github", name: "GitHub", url: "https://github.com/krizaka", kind: "open-source", group: "github", status: "released", mark: "github", repo: "https://github.com/krizaka" }),
];

/** The groups, in reading order. */
export const siteGroups: readonly SiteGroup[] = ["krizaka", "products", "open-source", "github"];

/** A site by id. */
export function siteById(id: SiteId): Site {
  const found = sites.find((s) => s.id === id);
  if (!found) throw new Error(`Unknown Krizaka site "${id}".`);
  return found;
}

/** The family grouped, in reading order: `[{ group, sites }]`, empty groups left out. */
export function sitesByGroup(): { group: SiteGroup; sites: Site[] }[] {
  return siteGroups.map((group) => ({ group, sites: sites.filter((s) => s.group === group) })).filter((g) => g.sites.length > 0);
}

/** The languages the family's words are written in. */
export type SiteLocale = "en" | "fr";

/** The words of the family: the switcher, the footer, each site's one line. */
export interface FamilyLabels {
  /** The family's name: the switcher's navigation and its button, the footer's navigation (“Krizaka family”). */
  family: string;
  /** The heading of each group. */
  groups: Record<SiteGroup, string>;
  /** The badge of a site that is not released. */
  status: Record<Exclude<SiteStatus, "released">, string>;
  /** Says which site is the current one (“You are here”). */
  current: string;
  /** One line per site: what it is. */
  descriptions: Record<SiteId, string>;
  /** The footer's signature, by the kind of the current site (“A Krizaka product”). */
  signature: Record<SiteKind, string>;
  /** The footer's place line (“Made in Montréal”). */
  place: string;
  /** The accessible name of the version (“Version”). */
  version: string;
}

/** The family's words in English and French. Pass `familyLabels[locale]`, or your own translation of the same shape. */
export const familyLabels: Record<SiteLocale, FamilyLabels> = {
  en: {
    family: "Krizaka family",
    groups: { krizaka: "Krizaka", products: "Products", "open-source": "Open source", github: "GitHub" },
    status: { upcoming: "Coming soon", construction: "Under construction", development: "In development" },
    current: "You are here",
    descriptions: {
      krizaka: "The company: our products, our open source, our story.",
      orazaka: "Sovereign AI, on your own servers.",
      orochia: "A video platform for creators.",
      yasakia: "The dating app where you talk first.",
      yororis: "A listening space with a face and a voice.",
      yomizaka: "Your documents, read and checked by Orazaka.",
      kachizaka: "Predictions among friends — live data, in real time.",
      akinaza: "Running a shop in Québec, for less — Loi 25 by design.",
      ui: "Components, tokens, icons and charts — web and React Native.",
      java: "Spring Boot building blocks on Maven Central.",
      github: "Every repository, in the open.",
    },
    signature: { company: "A Krizaka company", product: "A Krizaka product", "open-source": "A Krizaka open-source project" },
    place: "Made in Montréal",
    version: "Version",
  },
  fr: {
    family: "Famille Krizaka",
    groups: { krizaka: "Krizaka", products: "Produits", "open-source": "Open source", github: "GitHub" },
    status: { upcoming: "Bientôt", construction: "En construction", development: "En développement" },
    current: "Vous êtes ici",
    descriptions: {
      krizaka: "La compagnie : nos produits, notre open source, notre histoire.",
      orazaka: "L’IA souveraine, sur vos propres serveurs.",
      orochia: "Une plateforme vidéo pour les créateurs.",
      yasakia: "L’app de rencontre où l’on se parle d’abord.",
      yororis: "Un espace d’écoute avec un visage et une voix.",
      yomizaka: "Vos documents, lus et vérifiés par Orazaka.",
      kachizaka: "Les pronostics entre amis — des données en direct.",
      akinaza: "Tenir une boutique au Québec, pour moins cher — Loi 25 dès la conception.",
      ui: "Composants, jetons, icônes et graphiques — web et React Native.",
      java: "Des briques Spring Boot sur Maven Central.",
      github: "Tous les dépôts, au grand jour.",
    },
    signature: { company: "Une compagnie Krizaka", product: "Un produit Krizaka", "open-source": "Un projet open source de Krizaka" },
    place: "Fait à Montréal",
    version: "Version",
  },
};
