// Server-safe: plain data. The Krizaka family — every site Krizaka runs, once. The family switcher of the bar
// (`NavBar.Family`) and the common footer (`SiteFooter`) both read it, so adding a site is one release of this package:
// every bar and every footer of the family follow.
//
// The words of the family (a site's one line, the groups, the statuses, the footer's signature) are brand data, written
// here in English and French (`familyLabels`) — a site passes the set of its locale, or its own translation.

import type { OrgSocialLink } from "../site-footer/footer-config";

/** A site of the family. */
export type SiteId = "krizaka" | "sovkora" | "verikora" | "folioviv" | "ui" | "java" | "ts" | "rust" | "motion" | "lab" | "kridoc" | "blog" | "agents" | "github";

/** What a site is: the company, a product, or an open-source project. It chooses the footer's signature line. */
export type SiteKind = "company" | "product" | "open-source";

/**
 * `released`: open to visit. `upcoming`: announced, not released yet (said "Coming soon"). `construction`: under
 * construction — nothing offered (a QA-only app may run; the public page says so). `development`: being built in the
 * open, with a dev site (said "In development"). A site with none yet would use its repository as its address.
 */
export type SiteStatus = "released" | "upcoming" | "construction" | "development";

/** The groups of the family, in reading order: Krizaka · Products · Open source · GitHub. */
export type SiteGroup = "krizaka" | "products" | "open-source" | "github";

/** The mark a site wears: a brand of `ProductLogo` (Krizaka UI and Krizaka Java wear Krizaka's), or GitHub's. */
export type SiteMark = "krizaka" | "sovkora" | "verikora" | "folioviv" | "github";

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

/** The address as a person reads it: the host, and the path when there is one (`github.com/krizaka`). */
const hostOf = (url: string): string => {
  const { host, pathname } = new URL(url);
  return pathname === "/" ? host : host + pathname;
};
const site = (s: Omit<Site, "host">): Site => ({ ...s, host: hostOf(s.url) });

/** Every site of the family, in reading order (the group order, then the order inside each group). */
export const sites: readonly Site[] = [
  site({ id: "krizaka", name: "Krizaka", url: "https://www.krizaka.com", kind: "company", group: "krizaka", status: "released", mark: "krizaka", repo: "https://github.com/krizaka/krizaka-com" }),
  site({ id: "blog", name: "Blog", url: "https://blog.krizaka.com", kind: "company", group: "krizaka", status: "released", mark: "krizaka", repo: "https://github.com/krizaka/krizaka-blog" }),
  site({ id: "sovkora", name: "Sovkora", url: "https://www.sovkora.com", kind: "product", group: "products", status: "development", mark: "sovkora", repo: "https://github.com/krizaka/sovkora" }),
  site({ id: "verikora", name: "Verikora", url: "https://www.verikora.com", kind: "product", group: "products", status: "development", mark: "verikora", repo: "https://github.com/krizaka/verikora" }),
  site({ id: "folioviv", name: "Folioviv", url: "https://www.folioviv.com", kind: "product", group: "products", status: "development", mark: "folioviv", repo: "https://github.com/krizaka/folioviv" }),
  site({ id: "kridoc", name: "Kridoc", url: "https://www.kridoc.com", kind: "product", group: "products", status: "development", mark: "krizaka", repo: "https://github.com/krizaka/kridoc" }),
  site({ id: "ui", name: "Krizaka UI", url: "https://ui.krizaka.com", kind: "open-source", group: "open-source", status: "development", mark: "krizaka", repo: "https://github.com/krizaka/krizaka-ui" }),
  site({ id: "java", name: "Krizaka Java", url: "https://java.krizaka.com", kind: "open-source", group: "open-source", status: "development", mark: "krizaka", repo: "https://github.com/krizaka/krizaka-java" }),
  site({ id: "ts", name: "Krizaka TypeScript", url: "https://ts.krizaka.com", kind: "open-source", group: "open-source", status: "development", mark: "krizaka", repo: "https://github.com/krizaka/krizaka-ts" }),
  site({ id: "rust", name: "Krizaka Rust", url: "https://rust.krizaka.com", kind: "open-source", group: "open-source", status: "development", mark: "krizaka", repo: "https://github.com/krizaka/krizaka-rust" }),
  // The family lab: built in the open, served at lab.krizaka.com; what proves itself there moves into Krizaka UI.
  site({ id: "motion", name: "Krizaka Lab", url: "https://lab.krizaka.com", kind: "open-source", group: "open-source", status: "development", mark: "krizaka", repo: "https://github.com/krizaka/krizaka-lab" }),
  site({ id: "github", name: "GitHub", url: "https://github.com/krizaka", kind: "open-source", group: "github", status: "released", mark: "github", repo: "https://github.com/krizaka" }),
];

/**
 * A site the family does not list yet: it has a footer (`footerFor("agents")`) but no public address answers, so it stays out of
 * every list (the bar, the family columns) until the org flips its member to public and it moves into `sites`.
 */
const unlisted: readonly Site[] = [
  site({ id: "agents", name: "Krizaka Agents", url: "https://agents.krizaka.com", kind: "company", group: "krizaka", status: "upcoming", mark: "krizaka", repo: "https://github.com/krizaka/krizaka-agents" }),
];

/** The groups, in reading order. */
export const siteGroups: readonly SiteGroup[] = ["krizaka", "products", "open-source", "github"];

/** A site by id. */
export function siteById(id: SiteId): Site {
  // `lab` is the org's id of Krizaka Lab; the registry's own id is `motion` (kept, so nothing that names it breaks).
  const key = id === "lab" ? "motion" : id;
  const found = sites.find((s) => s.id === key) ?? unlisted.find((s) => s.id === key);
  if (!found) throw new Error(`Unknown Krizaka site "${id}".`);
  return found;
}

/** The family grouped, in reading order: `[{ group, sites }]`, empty groups left out. */
export function sitesByGroup(): { group: SiteGroup; sites: Site[] }[] {
  return siteGroups.map((group) => ({ group, sites: sites.filter((s) => s.group === group) })).filter((g) => g.sites.length > 0);
}

/** The languages the family's words are written in. */
export type SiteLocale = "en" | "fr";

/** The company's own links the footer's « Krizaka » column words: the org's pages (`org.family` blog, `org.contact`), never typed addresses. */
export type CompanyLinkId = "story" | "blog" | "contact";

/** The words of `FamilyFooter`'s rows: the accessible name of each group, and the row C links. */
export interface FamilyFooterWords {
  /** Row B's navigation (“Krizaka on social media”). */
  social: string;
  /** Row C's navigation (“This project”). */
  project: string;
  /** Row D's navigation (“Legal”). */
  legal: string;
  /** “Source code”. */
  source: string;
  /** “Release notes”. */
  releaseNotes: string;
}

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
  /** The words of `FamilyFooter`'s own rows. @default the English words */
  footer?: FamilyFooterWords;
  /** The language of these words: the company links open in it. @default "en" */
  lang?: SiteLocale;
  /** The company's pages in the footer's « Krizaka » column. @default the English words */
  company?: Partial<Record<CompanyLinkId, string>>;
}

/** Krizaka Lab's line, shared by its two ids (`motion` is the registry's, `lab` the org's). */
const LAB = { en: "The family lab: the kit's motion, played live with its knobs.", fr: "Le labo du mouvement : le mouvement du kit, joué en direct, avec ses réglages." } as const;

/** The family's words in English and French. Pass `familyLabels[locale]`, or your own translation of the same shape. */
export const familyLabels: Record<SiteLocale, FamilyLabels> = {
  en: {
    family: "Krizaka family",
    groups: { krizaka: "Krizaka", products: "Products", "open-source": "Open source", github: "GitHub" },
    status: { upcoming: "Coming soon", construction: "Under construction", development: "In development" },
    current: "You are here",
    descriptions: {
      krizaka: "The company: our products, our open source, our story.",
      sovkora: "Sovereign AI on your own servers: chat, documents, images and video — and the engine under the other products.",
      verikora: "Verikora reads your leases, contracts and invoices.",
      folioviv: "Running a shop in Québec, for less — Loi 25 by design.",
      ui: "Components, tokens, icons and charts — web and React Native.",
      java: "Spring Boot building blocks on Maven Central.",
      ts: "TypeScript backend building blocks on npm.",
      rust: "Rust crates for the desktop apps, on crates.io.",
      agents: "Krizaka Agents: how our software agents work, in the open.",
      motion: LAB.en,
      lab: LAB.en,
      kridoc: "Kridoc: documents, kept and found again.",
      blog: "The Krizaka blog: what we build and what we learn from it.",
      github: "Every repository, in the open.",
    },
    signature: { company: "A Krizaka company", product: "A Krizaka product", "open-source": "A Krizaka open-source project" },
    place: "Made in Montréal",
    version: "Version",
    lang: "en",
    company: { story: "Our story", blog: "Blog", contact: "Contact us" },
    footer: { social: "Krizaka on social media", project: "This project", legal: "Legal", source: "Source code", releaseNotes: "Release notes" },
  },
  fr: {
    family: "Famille Krizaka",
    groups: { krizaka: "Krizaka", products: "Produits", "open-source": "Open source", github: "GitHub" },
    status: { upcoming: "Bientôt", construction: "En construction", development: "En développement" },
    current: "Vous êtes ici",
    descriptions: {
      krizaka: "La compagnie : nos produits, notre open source, notre histoire.",
      sovkora: "L’IA souveraine sur vos propres serveurs : conversation, documents, images et vidéo — et le moteur des autres produits.",
      verikora: "Verikora lit vos baux, contrats et factures.",
      folioviv: "Tenir une boutique au Québec, pour moins cher — Loi 25 dès la conception.",
      ui: "Composants, jetons, icônes et graphiques — web et React Native.",
      java: "Des briques Spring Boot sur Maven Central.",
      ts: "Des briques backend TypeScript sur npm.",
      rust: "Des crates Rust pour les apps bureau, sur crates.io.",
      agents: "Krizaka Agents : comment travaillent nos agents logiciels, au grand jour.",
      motion: LAB.fr,
      lab: LAB.fr,
      kridoc: "Kridoc : des documents, gardés et retrouvés.",
      blog: "Le blogue de Krizaka : ce que nous construisons et ce que nous en apprenons.",
      github: "Tous les dépôts, au grand jour.",
    },
    signature: { company: "Une compagnie Krizaka", product: "Un produit Krizaka", "open-source": "Un projet open source de Krizaka" },
    place: "Fait à Montréal",
    version: "Version",
    lang: "fr",
    company: { story: "Notre histoire", blog: "Blogue", contact: "Nous écrire" },
    footer: { social: "Krizaka sur les réseaux", project: "Ce projet", legal: "Mentions légales", source: "Code source", releaseNotes: "Notes de version" },
  },
};

/**
 * What the footer and the bar read from `@krizaka/org` (the organisation's public facts, one validated JSON): the brand's
 * name, the footer line and the legal links, each in both languages. Structural: the whole `Org` of `@krizaka/org` fits.
 */
export interface OrgFacts {
  brand: { name: string };
  /**
   * The company's own accounts elsewhere (`org.links.social` of `@krizaka/org` ≥ 1.1.0): the footer draws each one as its
   * icon, linked to the address given here — never typed in a site. Optional so an older `org` still fits.
   */
  links?: { social: readonly OrgSocialLink[] };
  /**
   * Every name of the family (`org.family` of `@krizaka/org`, krizaka/krizaka-internal#754): when given, the footer reads
   * the names and addresses here, never from this package's registry — the company « Krizaka », products by their own
   * name, libraries « Krizaka <X> ».
   */
  family?: readonly OrgFamilyEntry[];
  /** The company's contact page (`org.contact` of `@krizaka/org`): the « Krizaka » column's last link. Optional so an older `org` still fits. */
  contact?: { page: Record<SiteLocale, string> };
  footer: {
    /** « Une entreprise de Technologies Krizaka · Fait à Montréal ». */
    line: Record<SiteLocale, string>;
    legal: readonly { id: string; label: Record<SiteLocale, string>; url: Record<SiteLocale, string> }[];
  };
}

/** One entry of `org.family` (`@krizaka/org`), the part the footer reads. */
export interface OrgFamilyEntry {
  id: string;
  name: string;
  group: SiteGroup;
  status: SiteStatus;
  url: string;
}

/** The family's words with the organisation's facts in them: the place line is the org's, not a copy. */
export function orgFamilyLabels(org: OrgFacts, locale: SiteLocale): FamilyLabels {
  return { ...familyLabels[locale], place: org.footer.line[locale] };
}
