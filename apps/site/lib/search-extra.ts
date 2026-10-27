/* What the search (⌘K) reads beyond a page's title, description and prose: a component page is generated from the
   registry, so its words come from there — what it is for, its props, its examples — plus the names developers type for it
   elsewhere (« modal » for Dialog). The tokens page gets every --kz-* name. Pure (tests/search.test.mjs); the index is
   built at build time (lib/search-index.ts) and downloaded by the dialog. */

/** The names a developer may type for a component, from other kits and the web at large. Keys are registry names. */
export const ALIASES: Readonly<Record<string, readonly string[]>> = {
  dialog: ["modal", "popup", "lightbox", "sheet", "drawer", "bottom sheet", "side panel", "alert dialog"],
  "action-sheet": ["bottom sheet", "actions menu"],
  switch: ["toggle", "on off"],
  toast: ["snackbar", "notification", "flash message"],
  "dropdown-menu": ["menu", "context menu", "overflow menu", "kebab"],
  popover: ["popup", "flyout"],
  tooltip: ["hint", "title"],
  combobox: ["autocomplete", "typeahead", "select", "dropdown"],
  "date-picker": ["calendar", "datepicker", "date input", "time picker"],
  "search-field": ["search input", "search bar"],
  chip: ["tag", "pill", "filter chip"],
  badge: ["label", "status", "pill"],
  "data-table": ["table", "grid", "datagrid"],
  pagination: ["pager", "page numbers"],
  "tag-input": ["tags", "multi value input"],
  avatar: ["profile picture", "user image"],
  "file-upload": ["dropzone", "upload", "file input"],
  "nav-bar": ["navbar", "header", "navigation", "top bar"],
  "tab-bar": ["bottom navigation", "bottom tabs"],
  tabs: ["tab list"],
  segmented: ["segmented control", "button group"],
  progress: ["progress bar", "progress ring"],
  loader: ["loading", "spinner", "busy"],
  spinner: ["loading", "activity indicator"],
  skeleton: ["placeholder", "shimmer", "loading state"],
  slider: ["range", "range input"],
  stepper: ["wizard", "steps", "multi step"],
  "step-progress": ["steps", "progress steps"],
  "otp-input": ["one time code", "verification code", "pin input"],
  "radio-group": ["radio", "options"],
  checkbox: ["check box", "tick"],
  field: ["input", "text field", "textarea", "form field"],
  form: ["form validation"],
  "empty-state": ["no data", "zero state", "blank slate"],
  alert: ["banner", "callout", "notice"],
  "confirm-button": ["press twice", "destructive action"],
  command: ["command palette", "cmdk", "spotlight"],
  "code-block": ["code snippet", "syntax highlighting"],
  "video-player": ["video", "media player"],
  "audio-player": ["audio", "podcast player"],
  "vertical-video": ["shorts", "reels", "stories"],
  map: ["maps", "geo", "location"],
  kanban: ["board", "columns"],
  "tree-view": ["tree", "file tree"],
  "image-cropper": ["crop"],
  card: ["panel", "tile"],
  separator: ["divider", "hr"],
  kbd: ["keyboard shortcut", "key"],
  "app-shell": ["layout", "sidebar layout", "dashboard shell"],
  "language-switch": ["locale", "i18n", "language picker"],
  "number-ticker": ["counter", "animated number"],
};

export interface SearchContent {
  heading?: string;
  content: string;
}

/** The registry's fields the search reads (a registry item has more). */
export interface SearchableItem {
  name: string;
  title: string;
  summary?: string | null;
  whenToUse?: readonly string[] | null;
  related?: readonly string[];
  web?: { examples?: readonly { title: string }[]; props?: readonly { component: string; props: readonly { name: string }[] }[] } | null;
  native?: { examples?: readonly { title: string }[] } | null;
}

/** A component page's extra words: synonyms, summary, what it is for, the components and props it exports, its examples. */
export function componentSearchContents(item: SearchableItem): SearchContent[] {
  const out: SearchContent[] = [];
  const aliases = ALIASES[item.name];
  if (aliases?.length) out.push({ content: `${item.title}: ${aliases.join(", ")}` });
  if (item.summary) out.push({ content: item.summary });
  for (const use of item.whenToUse ?? []) out.push({ content: use });
  for (const group of item.web?.props ?? []) {
    const names = group.props.map((p) => p.name).filter((n) => !/^on[A-Z]|^(className|asChild|children|ref)$/.test(n));
    out.push({ heading: group.component, content: `${group.component}${names.length ? `: ${names.join(", ")}` : ""}` });
  }
  const examples = [...(item.web?.examples ?? []), ...(item.native?.examples ?? [])].map((e) => e.title);
  if (examples.length) out.push({ content: [...new Set(examples)].join(" · ") });
  return out;
}

/** The tokens page's extra words: every --kz-* custom property @krizaka/tokens defines (`tokens`: key → `var(--kz-…)`). */
export function tokenSearchContents(tokens: Readonly<Record<string, unknown>>): SearchContent[] {
  const names = [...new Set(Object.values(tokens).flatMap((v) => String(v).match(/--kz-[\w-]+/g) ?? []))].sort((a, b) => a.localeCompare(b));
  return names.map((name) => ({ content: name }));
}
