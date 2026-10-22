// The documentation of a component, carried by its code: each primitive has a `meta.ts` beside its source
// (`src/<name>/meta.ts`; a component that exists only in React Native: `src/native/meta/<name>.ts`). Never built into
// the package: `scripts/build-registry.mjs` reads them into `registry/<name>.json`, which ui.krizaka.com (apps/site) renders as
// ui.krizaka.com/components/<name>, and `scripts/registry.test.mjs` fails when one is missing or incomplete.
//
// Why a typed module and not JSDoc tags: the fields are lists and links (`related`, `whenNotToUse[].use`, examples),
// which a type checks and a comment does not; the file is plain data (erasable TypeScript), so Node reads it without a
// compiler, and an editor completes it.

/** Every documented component: the web primitives (one entry of the package each) and the native-only ones. */
export type ComponentName =
  | "notification-preferences"
  | "agenda"
  | "account-settings"
  | "drop-overlay"
  | "upload-queue"
  | "achievement"
  | "anatomy-plate"
  | "bird-plate"
  | "flock"
  | "elephant"
  | "footnote"
  | "page-index"
  | "specimen-tag"
  | "action-bar"
  | "action-sheet"
  | "activity-feed"
  | "alert"
  | "app-header"
  | "app-shell"
  | "argument-card"
  | "audio-player"
  | "auth-layout"
  | "avatar"
  | "badge"
  | "button"
  | "captcha"
  | "card"
  | "card-grid"
  | "catalogue-page"
  | "changelog-page"
  | "chat"
  | "checkbox"
  | "chip"
  | "chip-link"
  | "chip-row"
  | "choice-grid"
  | "cn"
  | "code-block"
  | "combobox"
  | "comparison-table"
  | "command"
  | "component-page"
  | "confirm-button"
  | "contact-page"
  | "continue-prompt"
  | "countdown"
  | "cover-hero"
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
  | "docs-nav"
  | "document-viewer"
  | "dropdown-menu"
  | "empty-state"
  | "engine-flow"
  | "error-page"
  | "fab"
  | "field"
  | "file-upload"
  | "filter-bar"
  | "force-update-screen"
  | "form"
  | "gallery-page"
  | "genui"
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
  | "longform-page"
  | "maintenance-screen"
  | "map"
  | "markdown"
  | "meta-row"
  | "waveform"
  | "marketing-layout"
  | "marquee"
  | "mascot-quote"
  | "mascot-state"
  | "mascots"
  | "match-dialog"
  | "media-capture"
  | "media-grid"
  | "language-switch"
  | "media-gallery"
  | "media-picker"
  | "meter"
  | "nav-bar"
  | "number-ticker"
  | "onboarding"
  | "opening-hours"
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
  | "router"
  | "rail-nav"
  | "recipes"
  | "screen"
  | "scroll-stage"
  | "search-field"
  | "section-backdrop"
  | "segmented"
  | "separator"
  | "service-card"
  | "settings-layout"
  | "account-menu"
  | "showcase"
  | "step-showcase"
  | "site-footer"
  | "sites"
  | "skeleton"
  | "skip-link"
  | "slider"
  | "slot-picker"
  | "slot"
  | "spinner"
  | "sticky-action"
  | "splash-handoff"
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
  | "update-prompt"
  | "verified-badge"
  | "vertical-video"
  | "video-player"
  | "video-trimmer"
  | "virtual";

/** Where a component exists: `@krizaka/ui/<name>` (web), `@krizaka/ui/native` (React Native), or both. */
export type Platform = "web" | "native" | "both";

/**
 * Why a component is not on a platform — a decision, never a silence (the parity matrix of ui.krizaka.com/platforms):
 * - `gap` (✗): it belongs there and is not built yet; `issue` is the issue that tracks it (`krizaka/krizaka-ui#275`);
 * - `n/a`: it is not meant for that platform (a site's page block on a phone, a swipe on a desktop); `use` names the
 *   component that answers there, when one does.
 */
export type Absence =
  | { readonly status: "gap"; readonly issue: string; readonly reason: string; readonly use?: undefined }
  | { readonly status: "n/a"; readonly reason: string; readonly use?: ComponentName; readonly issue?: undefined };

/**
 * Desktop is the Orazaka Mac app (Tauri 2: the system WebView renders the web components — ADR-002). `web`: the web
 * component runs there as it is; `desktop`: it also has a desktop form (a window's title bar, a denser layout…), said in
 * its documentation; otherwise the absence and why.
 */
export type DesktopSupport = "web" | "desktop" | Absence;

/**
 * The three platforms of Krizaka UI — web · native (React Native, Expo) · desktop — for one component. The side a
 * component has is `platforms`; the side it lacks says why here: `native` is required for (and only for) a web-only
 * component, `web` for a native-only one; `desktop` always. `scripts/registry.test.mjs` fails on a missing decision.
 */
export interface Parity {
  readonly web?: Absence;
  readonly native?: Absence;
  readonly desktop: DesktopSupport;
}

/**
 * `stable`: its API only changes in a major. `beta`: it may still change in a minor. `deprecated`: no product uses it and
 * no work plans to — it still works, says what replaces it, and goes in the major named by `deprecated.removedIn`.
 */
export type Status = "stable" | "beta" | "deprecated";

/** What a deprecated component says (required when `status` is `deprecated`, absent otherwise). */
export interface Deprecation {
  /** The version that deprecated it (`3.6.0`). */
  readonly since: string;
  /** The major that removes it (`4.0.0`). */
  readonly removedIn: string;
  /** What replaces it, when a component does. */
  readonly use?: ComponentName;
  /** Why it goes: no product uses it, no planned work needs it. */
  readonly reason: string;
}

/**
 * The group of the catalogue. `media`: video, sound, camera, files, cropping. `blocks`: the page blocks — the frame,
 * the hero, sections, cards that lead or argue, decisions, code, calls to act — that every page of a site is made of.
 * `layouts`: the shells of whole screens — an application, a dashboard, settings, sign-in, an object, a list and its
 * item, a site's page, a documentation page — each with its screens. `templates`: the page templates — whole pages of a
 * site (a landing, a product, a docs hub, a long read, a changelog, pricing, status, an error…), each a distinct
 * composition of the blocks, words and content as props.
 */
export type Category = "actions" | "forms" | "navigation" | "overlays" | "feedback" | "data-display" | "media" | "blocks" | "layouts" | "templates" | "layout" | "foundations";

/** Why a reader needs a template: the seven intents the templates are grouped by (sidebar sub-headings, catalogue filter). */
export type TemplatePurpose = "convince" | "explain" | "show" | "act" | "operate" | "converse" | "recover";

/** The groups of templates, in reading order: the title, and the one line that says when to come to that group. */
export const templatePurposes = {
  convince: { title: "Convince", useWhen: "You come here when a visitor must decide: a landing, a product, a price, a comparison, a proof." },
  explain: { title: "Explain", useWhen: "You come here when a reader must understand: how it works, a documentation hub or article, a changelog, a FAQ, a policy." },
  show: { title: "Show", useWhen: "You come here when the work itself is the argument: a gallery, a story, a case study, an object and its details." },
  act: { title: "Act", useWhen: "You come here when a person must do something once: reach the team, sign in or up, set up, pay." },
  operate: { title: "Operate", useWhen: "You come here when a person works every day: a dashboard, a console with a table, settings, an app shell." },
  converse: { title: "Converse", useWhen: "You come here when people talk: an inbox, a chat, comments, a notifications centre." },
  recover: { title: "Recover", useWhen: "You come here when the way is blocked: an empty list, an error, a missing page, maintenance, a product still being built." },
} as const satisfies Record<TemplatePurpose, { readonly title: string; readonly useWhen: string }>;

/**
 * A named example: the file `registry/examples/<component>/<name>.tsx` (web) or
 * `registry/examples/<component>/native/<name>.tsx` (React Native) — at most 40 lines, imported by the stories and
 * shown (live, with its code) by the documentation.
 */
interface ExampleBase {
  /** The file name, kebab-case (`primary`, `icon-button`). */
  readonly name: string;
  /** A short title (`Primary`, `Icon button`). */
  readonly title: string;
  /** One or two sentences: when this variant is the right one. */
  readonly description: string;
}

/** A plain example, or a template: a whole screen with its intent (`purpose`) and the user goal its layout serves (`why`). */
export type Example =
  | (ExampleBase & { readonly template?: false; readonly purpose?: undefined; readonly why?: undefined })
  | (ExampleBase & {
      /**
       * A template: a whole screen of a product composed from the platform (a layout and its blocks, real words, its
       * phone version thought out), copied as a starting point — at most 160 lines, listed on ui.krizaka.com/templates.
       */
      readonly template: true;
      /** The intent that groups it: why you need this block. */
      readonly purpose: TemplatePurpose;
      /** Why this layout: the user goal it serves, in one sentence. */
      readonly why: string;
    });

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
  /** Required for, and only for, a `deprecated` component. */
  readonly deprecated?: Deprecation;
  readonly category: Category;
  /** Must match the sides below: `both` ⇔ `web` and `native`. */
  readonly platforms: Platform;
  /** The platforms it is not on, and why; and its desktop form (see `Parity`). */
  readonly parity: Parity;
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
