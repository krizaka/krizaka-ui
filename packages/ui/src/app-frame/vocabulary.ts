// Server-safe: data and pure functions, no React. The words every Krizaka product says the same way (the audit's F4): the
// frame's menus, the public bar's links and the footers read them, so « Docs », « Terms » and « Settings » never differ
// between two products. English is the reference; a French key is required by the type.
export const navWords = {
  en: {
    docs: "Docs",
    terms: "Terms",
    privacy: "Privacy",
    settings: "Settings",
    billing: "Billing",
    profile: "Profile",
    administration: "Administration",
    account: "Account",
    language: "Language",
    theme: "Theme",
    themeLight: "Light",
    themeDark: "Dark",
    themeSystem: "System",
    signOut: "Sign out",
    howItWorks: "How it works",
    pricing: "Pricing",
    download: "Download",
    contact: "Contact",
    search: "Search",
    notifications: "Notifications",
    expand: "Show the words",
    collapse: "Hide the words",
  },
  fr: {
    docs: "Docs",
    terms: "Conditions d'utilisation",
    privacy: "Confidentialité",
    settings: "Réglages",
    billing: "Facturation",
    profile: "Profil",
    administration: "Administration",
    account: "Compte",
    language: "Langue",
    theme: "Thème",
    themeLight: "Clair",
    themeDark: "Sombre",
    themeSystem: "Système",
    signOut: "Se déconnecter",
    howItWorks: "Comment ça marche",
    pricing: "Tarifs",
    download: "Télécharger",
    contact: "Contact",
    search: "Rechercher",
    notifications: "Notifications",
    expand: "Afficher les mots",
    collapse: "Masquer les mots",
  },
} as const satisfies Record<"en" | "fr", Record<string, string>>;

export type NavLocale = keyof typeof navWords;
export type NavWords = { [K in keyof (typeof navWords)["en"]]: string };
export type NavWordKey = keyof NavWords;

/** The words of a locale (`fr`, `fr-CA`…); any other falls back to English. */
export function navVocabulary(locale: string = "en"): NavWords {
  return navWords[locale.toLowerCase().startsWith("fr") ? "fr" : "en"];
}

/** One word of the shared vocabulary. */
export function navWord(locale: string | undefined, key: NavWordKey): string {
  return navVocabulary(locale)[key];
}

/** The most links a product's public bar holds: past four, the bar is a menu in disguise (audit F3). */
export const PUBLIC_BAR_MAX = 4;

export type PublicBarSlot = "howItWorks" | "pricing" | "docs" | "download";
export interface PublicBarLink {
  id: PublicBarSlot;
  label: string;
  href: string;
}

/**
 * The one shape of a product's public bar: flat links, in this order, four at most — How it works · Pricing (when the
 * product has a price) · Docs · Download (when an app exists). Privacy and Terms are the footer's, « Overview » is the mark.
 * Pass the address of each slot the product has; the words come from the shared vocabulary.
 */
export function publicBarLinks(hrefs: Partial<Record<PublicBarSlot, string>>, locale?: string): PublicBarLink[] {
  const order: PublicBarSlot[] = ["howItWorks", "pricing", "docs", "download"];
  return order.flatMap((id) => {
    const href = hrefs[id];
    return href ? [{ id, label: navWord(locale, id), href }] : [];
  });
}
