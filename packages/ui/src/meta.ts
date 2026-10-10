// The documentation of a component, carried by its code: each primitive has a `meta.ts` beside its source
// (`src/<name>/meta.ts`; a component that exists only in React Native: `src/native/meta/<name>.ts`). Never built into
// the package: `scripts/build-registry.mjs` reads them into `registry/<name>.json`, which krizaka.com renders as
// /docs/ui/<name>, and `scripts/registry.test.mjs` fails when one is missing or incomplete.
//
// Why a typed module and not JSDoc tags: the fields are lists and links (`related`, `whenNotToUse[].use`, examples),
// which a type checks and a comment does not; the file is plain data (erasable TypeScript), so Node reads it without a
// compiler, and an editor completes it.

/** Every documented component: the web primitives (one entry of the package each) and the native-only ones. */
export type ComponentName =
  | "alert"
  | "avatar"
  | "badge"
  | "button"
  | "card"
  | "checkbox"
  | "chip"
  | "cn"
  | "command"
  | "confirm-button"
  | "countdown"
  | "dialog"
  | "dropdown-menu"
  | "empty-state"
  | "field"
  | "kbd"
  | "page-header"
  | "popover"
  | "progress"
  | "radio-group"
  | "section-backdrop"
  | "segmented"
  | "separator"
  | "skeleton"
  | "slider"
  | "slot"
  | "spinner"
  | "stat"
  | "switch"
  | "tabs"
  | "theme"
  | "toast"
  | "tooltip"
  | "txt";

/** Where a component exists: `@krizaka/ui/<name>` (web), `@krizaka/ui/native` (React Native), or both. */
export type Platform = "web" | "native" | "both";

/** `stable`: its API only changes in a major. `beta`: it may still change in a minor. */
export type Status = "stable" | "beta";

/** The group of the catalogue. */
export type Category = "actions" | "forms" | "navigation" | "overlays" | "feedback" | "data-display" | "layout" | "foundations";

/**
 * A named example: the file `registry/examples/<component>/<name>.tsx` (web) or
 * `registry/examples/<component>/native/<name>.tsx` (React Native) — at most 40 lines, imported by the stories and
 * shown (live, with its code) by the documentation.
 */
export interface Example {
  /** The file name, kebab-case (`primary`, `icon-button`). */
  readonly name: string;
  /** A short title (`Primary`, `Icon button`). */
  readonly title: string;
  /** One or two sentences: when this variant is the right one. */
  readonly description: string;
}

/** One platform's side of a component. */
export interface PlatformDocs {
  /** The names to import (`["Button", "IconButton"]`): from `@krizaka/ui/<name>` on the web, `@krizaka/ui/native` in React Native. */
  readonly imports: readonly string[];
  /** The examples, in reading order; the first one is the component's preview. */
  readonly examples: readonly Example[];
}

/** The React Native side: the same concept, and what differs from the web API. */
export interface NativeDocs extends PlatformDocs {
  /** What differs from the web API (`label` instead of children…); empty for a native-only component. */
  readonly differences: readonly string[];
}

export interface KeyboardInteraction {
  /** The keys, as written on a keyboard: `Space`, `Enter`, `Arrow keys`, `Esc`, `Tab`. */
  readonly keys: string;
  /** What they do. */
  readonly action: string;
}

export interface ComponentMeta {
  /** The display name: `Button`, `Dropdown menu`. */
  readonly title: string;
  /** One sentence: what it is. */
  readonly summary: string;
  readonly status: Status;
  readonly category: Category;
  /** Must match the sides below: `both` ⇔ `web` and `native`. */
  readonly platforms: Platform;
  /** When to reach for it: concrete situations, one per item. */
  readonly whenToUse: readonly string[];
  /** When not to — and what to use instead (`use`), when another component is the answer. */
  readonly whenNotToUse: readonly { readonly when: string; readonly use?: ComponentName }[];
  /** How to use it well: wording, placement, composition. */
  readonly bestPractices: readonly string[];
  readonly accessibility: {
    /** The keyboard, when it does more than Tab and Enter. */
    readonly keyboard: readonly KeyboardInteraction[];
    /** Roles, names and announcements: what the component does, what the app must provide. */
    readonly notes: readonly string[];
  };
  /** The components a reader of this page should know about. */
  readonly related: readonly ComponentName[];
  readonly web?: PlatformDocs;
  readonly native?: NativeDocs;
}
