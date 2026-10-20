/* The Orazaka web client's navigation, read from its source (src/core/config/app-sections.ts and the `appNav` words of
   src/core/context/translations.ts) so the home's scene draws the rail the app really has. Pure: no network, no disk. */

const SECTION = /\{\s*id:\s*AppSectionId\.(\w+),\s*href:\s*"([^"]+)",\s*Icon:\s*(\w+),[^}]*?place:\s*AppSectionPlace\.(\w+)([^}]*)\}/g;

/** The sections in the app's order: `main` (where you work; Home is the mark, not an item) and `foot` (Settings). Admin is for admins only and is left out. */
export function parseSections(source) {
  const sections = [...source.matchAll(SECTION)].map(([, id, href, icon, place, rest]) => ({
    id: id.toLowerCase(),
    href,
    icon,
    place: place.toLowerCase(),
    adminOnly: /adminOnly:\s*true/.test(rest),
  }));
  if (sections.length === 0) throw new Error("no section found in app-sections.ts");
  return sections;
}

/** Every `appNav: { key: "word", … }` block of the translations, in the file's order (English, then French). */
export function parseAppNav(source) {
  const blocks = [...source.matchAll(/appNav:\s*\{([^}]*)\}/g)].map((m) => Object.fromEntries([...m[1].matchAll(/(\w+):\s*"((?:[^"\\]|\\.)*)"/g)].map((w) => [w[1], w[2]])));
  if (blocks.length < 2) throw new Error("expected an English and a French appNav");
  return { en: blocks[0], fr: blocks[1] };
}

/** What the scene reads: the rail's items with their icon name and their words in both languages. */
export function buildNav(sectionsSource, translationsSource) {
  const sections = parseSections(sectionsSource).filter((s) => !s.adminOnly);
  const words = parseAppNav(translationsSource);
  const item = (s) => {
    const label = { en: words.en[s.id], fr: words.fr[s.id] };
    if (!label.en || !label.fr) throw new Error(`appNav has no words for ${s.id}`);
    return { id: s.id, icon: s.icon, label };
  };
  return {
    main: sections.filter((s) => s.place === "main" && s.id !== "home").map(item),
    foot: sections.filter((s) => s.place === "foot").map(item),
  };
}
