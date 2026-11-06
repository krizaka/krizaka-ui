// WHY  The catalogue's concepts (confirmation, command palette, table, list, theme, dialog…) are data: the words that name them, the modules that build them, the signature of a hand-made copy.
// WHAT CONCEPTS, COMPOSITES, the matchers (`hasSuffix`, `mentionsPrimitive`, `importsFromAny`) and `conceptOf`.
// HOW  Imported by tools/inventory.mjs (which re-exports it); nothing to run. Tests: tools/inventory.test.mjs.
// OWNER krizaka-ui (lane platform), ADR-026 phase D.

/** The libraries a product imports to virtualise a list by hand (the signature of the `list` concept). */
export const VIRTUAL_LIST_LIBRARIES = [
  ...["@tanstack/virtual", "@tanstack/react-virtual", "@tanstack/virtual-core", "@tanstack/react-virtual-core"],
  ...["@shopify/flash-list", "react-window", "react-virtualized"],
];
/** `from "x"`: the module specifiers a file imports or re-exports from. */
const FROM_SPECIFIER = /from\s+["']([^"']+)["']/g;
/** A signature that holds when the file imports one of the modules: `{ test, source }` like a RegExp, `source` is shown in the report. */
export function importsFromAny(modules) {
  return {
    test: (text) => [...text.matchAll(FROM_SPECIFIER)].some((m) => modules.includes(m[1])),
    source: `from ${modules.map((m) => `"${m}"`).join(" | ")}`,
  };
}

/** The concepts of the catalogue (study §2.1), most specific first: a name is given to the first concept it matches.
    `names`: the catalogue's own names; `suffixes`: the endings of a product component carrying the concept (or `{ prefix | contains, endsWith }`
    for a name that starts with, or contains, a word); `primitives`: the `@krizaka/ui/<module>` that build the concept; `signature`: what a
    file does when it re-does the primitive by hand. */
export const CONCEPTS = [
  {
    id: "confirm",
    label: "Confirmation d'action",
    target: "@krizaka/ui/confirm-button · AlertDialog",
    names: ["ConfirmDialog", "ConfirmButton", "ConfirmIconButton", "AlertDialog"],
    suffixes: { contains: "Confirm", endsWith: ["Dialog","Button","Modal"] },
    primitives: ["confirm-button","dialog"],
  },
  {
    id: "command",
    label: "Palette de commandes / recherche",
    target: "@krizaka/ui/command",
    names: ["Command", "CommandPalette", "SearchCommand", "GlobalSearchModal", "SearchModal", "SearchPalette"],
    suffixes: ["CommandPalette","SearchCommand","SearchModal","SearchPalette"],
    primitives: ["command"],
    signature: /from\s+["']cmdk["']/,
  },
  {
    // PS2: a table with its own engine (sorting, selection, filters written by hand, or TanStack Table imported by the
    // app) is a duplicate of @krizaka/ui/data-table v2. A plain <table> of text (a schema's text version) is not.
    id: "table",
    label: "Table de données",
    target: "@krizaka/ui/data-table",
    names: ["DataTable", "DataGrid", "Table", "SortableTable"],
    suffixes: ["DataTable","DataGrid","SortableTable"],
    primitives: ["data-table"],
    signature: /from\s+["']@tanstack\/(react-)?table(-core)?["']/,
  },
  {
    // PS2: a virtualised list or an infinite feed written by hand (or on TanStack Virtual / FlashList imported by the
    // app) is a duplicate of @krizaka/ui/virtual (web) and @krizaka/ui/native/list (React Native).
    id: "list",
    label: "Liste longue / virtualisée",
    target: "@krizaka/ui/virtual · native/list",
    names: ["VirtualList", "VirtualGrid", "InfiniteList", "VirtualizedList"],
    suffixes: ["VirtualList","VirtualGrid","InfiniteList","VirtualizedList"],
    primitives: ["virtual","native/list"],
    signature: importsFromAny(VIRTUAL_LIST_LIBRARIES),
  },
  {
    id: "theme",
    label: "Thème (provider, bascule)",
    target: "@krizaka/ui/theme",
    names: ["ThemeProvider", "ThemeToggle", "ThemeModeSelector", "ThemeSwitcher", "ThemeSwitch"],
    suffixes: { prefix: "Theme", endsWith: ["Provider","Toggle","Selector","Switcher","Switch"] },
    primitives: ["theme"],
    signature: /classList\.(add|remove|toggle)\(\s*["'`](light|dark)["'`]/,
  },
  {
    id: "dialog",
    label: "Dialogue / feuille",
    target: "@krizaka/ui/dialog",
    names: ["Dialog", "Sheet", "Modal", "BottomSheet", "Drawer"],
    suffixes: ["Dialog","Sheet","Modal","Drawer"],
    primitives: ["dialog","command"],
    signature: /role=["']dialog["']|aria-modal=|createPortal\(/,
  },
  {
    id: "toast",
    label: "Toast",
    target: "@krizaka/ui/toast",
    names: ["Toast", "Toaster", "ToastProvider", "ToastContext", "ToastOverlay"],
    suffixes: ["Toast","Toasts","ToastContext","ToastOverlay","ToastProvider"],
    primitives: ["toast"],
  },
  {
    id: "tabs",
    label: "Onglets / segments",
    target: "@krizaka/ui/tabs · Segmented",
    names: ["Tabs", "Segmented", "Segments", "SegmentedControl", "TabBar"],
    suffixes: ["Tabs","Segmented","Segments","SegmentedControl"],
    primitives: ["tabs"],
    signature: /role=["']tablist["']/,
  },
  {
    id: "switch",
    label: "Switch",
    target: "@krizaka/ui/switch",
    names: ["Switch", "Toggle"],
    suffixes: ["Switch"],
    primitives: ["switch"],
    signature: /role=["']switch["']/,
  },
  {
    id: "slider",
    label: "Slider",
    target: "@krizaka/ui/slider",
    names: ["Slider", "Range"],
    suffixes: ["Slider"],
    primitives: ["slider"],
    signature: /role=["']slider["']|type=["']range["']/,
  },
  {
    id: "countdown",
    label: "Compte à rebours",
    target: "@krizaka/ui/countdown",
    names: ["Countdown", "CountdownTimer"],
    suffixes: ["Countdown"],
    primitives: ["countdown"],
  },
  {
    id: "avatar",
    label: "Avatar",
    target: "@krizaka/ui/avatar",
    names: ["Avatar", "AvatarGroup"],
    suffixes: ["Avatar"],
    primitives: ["avatar"],
  },
  {
    id: "skeleton",
    label: "Squelette / vide / état async",
    target: "@krizaka/ui/skeleton · empty-state · spinner",
    names: ["Skeleton", "Empty", "EmptyState", "AsyncState", "Spinner", "Loader"],
    suffixes: ["Skeleton","EmptyState","AsyncState"],
    primitives: ["skeleton","empty-state","spinner"],
  },
  {
    id: "field",
    label: "Champ de formulaire",
    target: "@krizaka/ui/field · checkbox · radio-group",
    names: ["Input", "Field", "TextField", "Textarea", "Select", "Checkbox", "FormField"],
    suffixes: ["Field","Input"],
    primitives: ["field","checkbox","radio-group"],
  },
  {
    id: "badge",
    label: "Badge / pastille / chip",
    target: "@krizaka/ui/badge · chip",
    names: ["Badge", "Chip", "Pill", "Tag"],
    suffixes: ["Badge","Chip","Pill"],
    primitives: ["badge","chip"],
  },
  {
    id: "card",
    label: "Carte",
    target: "@krizaka/ui/card",
    names: ["Card", "CardHeader", "CardBody", "CardFooter", "Panel", "Tile", "Tiles"],
    suffixes: ["Card"],
    primitives: ["card","stat"],
  },
  {
    id: "button",
    label: "Bouton",
    target: "@krizaka/ui/button",
    names: ["Button", "IconButton", "PrimaryButton", "buttonClass", "buttonVariants"],
    suffixes: ["Button"],
    primitives: ["button","confirm-button"],
  },
];

/** Product composites the study lists as legitimate (§2.2, level 2), whatever they import. */
export const COMPOSITES = new Set([
  "AuctionStatusBadge", "LiveBadge", "SocialIcon", "StoryRing", "AgeGate", "SentinelMini", "PackCard", "StudioCard",
  "NotificationBell",
]);

/** An import that builds on the platform for every concept: React Native gets all its primitives from one entry. */
export const NATIVE = /@krizaka\/ui\/native\b/;
/** The product design systems: a component built on them builds on the primitives they re-export. */
export const PRODUCT_KIT = /@krizaka\/[a-z]+-design-system\b/;

/** One character of an identifier-like word (`\w`): the endings below only apply to plain names. */
const PLAIN_NAME = /^\w+$/;

/** True when `name` ends with one of `endings`, after `rest` characters at least (the ending must not overlap what came before). */
const endsWithAny = (name, endings, rest = 0) => endings.some((e) => name.endsWith(e) && name.length - e.length >= rest);

/** True when a product component name carries the concept: it ends with one of the suffixes, or starts with / contains a word then ends with one. */
export function hasSuffix(name, rule) {
  if (Array.isArray(rule)) return endsWithAny(name, rule);
  if (!PLAIN_NAME.test(name)) return false;
  if (rule.prefix !== undefined) return name.startsWith(rule.prefix) && endsWithAny(name, rule.endsWith, rule.prefix.length);
  const at = name.indexOf(rule.contains);
  return at >= 0 && endsWithAny(name, rule.endsWith, at + rule.contains.length);
}

/** True when the text names one of the concept's primitives: `@krizaka/ui/<module>` followed by the end of a word. */
export function mentionsPrimitive(text, primitives) {
  return primitives.some((module) => {
    const needle = `@krizaka/ui/${module}`;
    for (let at = text.indexOf(needle); at !== -1; at = text.indexOf(needle, at + 1)) {
      if (!/\w/.test(text[at + needle.length] ?? "")) return true;
    }
    return false;
  });
}

/** The concept a name belongs to, and how (`name`: a catalogue name; `suffix`: a product component). */
export function conceptOf(name) {
  for (const c of CONCEPTS) if (c.names.includes(name)) return { concept: c, by: "name" };
  for (const c of CONCEPTS) if (hasSuffix(name, c.suffixes)) return { concept: c, by: "suffix" };
  return undefined;
}

