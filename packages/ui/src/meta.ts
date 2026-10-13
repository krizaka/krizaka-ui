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
  | "achievement"
  | "action-bar"
  | "activity-feed"
  | "action-sheet"
  | "alert"
  | "app-shell"
  | "argument-card"
  | "audio-player"
  | "auth-layout"
  | "avatar"
  | "badge"
  | "button"
  | "card"
  | "card-grid"
  | "catalogue-page"
  | "changelog-page"
  | "chat"
  | "checkbox"
  | "chip"
  | "chip-link"
  | "choice-grid"
  | "cn"
  | "code-block"
  | "combobox"
  | "command"
  | "component-page"
  | "confirm-button"
  | "contact-page"
  | "continue-prompt"
  | "countdown"
  | "cta-panel"
  | "dashboard-layout"
  | "data-table"
  | "date-picker"
  | "decision-list"
  | "description-list"
  | "detail-layout"
  | "dialog"
  | "docs-article-page"
  | "docs-hub-page"
  | "docs-layout"
  | "dropdown-menu"
  | "empty-state"
  | "error-page"
  | "fab"
  | "field"
  | "file-upload"
  | "filter-bar"
  | "form"
  | "gallery-page"
  | "glow-card"
  | "goal-gauge"
  | "header"
  | "how-it-works-page"
  | "image-cropper"
  | "image-viewer"
  | "iso"
  | "kanban"
  | "kbd"
  | "landing-page"
  | "landscape"
  | "legal-page"
  | "link-card"
  | "list"
  | "loader"
  | "map"
  | "longform-page"
  | "marketing-layout"
  | "marquee"
  | "mascot-quote"
  | "mascot-state"
  | "mascots"
  | "match-dialog"
  | "media-capture"
  | "media-picker"
  | "meter"
  | "nav-bar"
  | "number-ticker"
  | "onboarding"
  | "otp-input"
  | "page"
  | "page-header"
  | "page-hero"
  | "pagination"
  | "permission-prompt"
  | "photo-grid"
  | "pointer-light"
  | "popover"
  | "pricing-page"
  | "product-page"
  | "profile-card"
  | "progress"
  | "promise-card"
  | "pull-to-refresh"
  | "radio-group"
  | "screen"
  | "scroll-stage"
  | "search-field"
  | "section-backdrop"
  | "segmented"
  | "separator"
  | "settings-layout"
  | "skeleton"
  | "slider"
  | "slot"
  | "spinner"
  | "split-view"
  | "stage-banner"
  | "stat"
  | "status-page"
  | "step-progress"
  | "stepper"
  | "swipe-deck"
  | "swipeable-row"
  | "switch"
  | "tab-bar"
  | "tabs"
  | "tag-input"
  | "tag-selector"
  | "terminal-replay"
  | "theme"
  | "toast"
  | "toc"
  | "tooltip"
  | "tree-view"
  | "txt"
  | "verified-badge"
  | "video-player"
  | "video-trimmer"
  | "virtual";

/** Where a component exists: `@krizaka/ui/<name>` (web), `@krizaka/ui/native` (React Native), or both. */
export type Platform = "web" | "native" | "both";

/** `stable`: its API only changes in a major. `beta`: it may still change in a minor. */
export type Status = "stable" | "beta";

/**
 * The group of the catalogue. `media`: video, sound, camera, files, cropping. `blocks`: the page blocks — the frame,
 * the hero, sections, cards that lead or argue, decisions, code, calls to act — that every page of a site is made of.
 * `layouts`: the shells of whole screens — an application, a dashboard, settings, sign-in, an object, a list and its
 * item, a site's page, a documentation page — each with its screens. `templates`: the page templates — whole pages of a
 * site (a landing, a product, a docs hub, a long read, a changelog, pricing, status, an error…), each a distinct
 * composition of the blocks, words and content as props.
 */
export type Category = "actions" | "forms" | "navigation" | "overlays" | "feedback" | "data-display" | "media" | "blocks" | "layouts" | "templates" | "layout" | "foundations";

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
  /**
   * A template: a whole screen of a product composed from the platform (a layout and its blocks, real words, its phone
   * version thought out), copied as a starting point — at most 160 lines, listed on krizaka.com/docs/ui/templates.
   */
  readonly template?: boolean;
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
  /**
   * The entry to import from when it is not `@krizaka/ui/native`: a component that needs an Expo module (an optional
   * peer) has its own, `@krizaka/ui/native/<name>`, so an app that does not use it never installs the module.
   */
  readonly entry?: string;
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
