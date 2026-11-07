// The documentation of a component of the kit, carried by its code — the same format as @krizaka/ui's (`src/meta.ts`
// in krizaka-ui), plus what a product component owes its reader: why it exists above Krizaka UI, the primitives it is
// built on, and, when it is deprecated, what replaces it. Each component has a `<name>.meta.ts` beside it; never built
// into the package: `scripts/build-registry.mjs` reads them into `registry/<name>.json`, which krizaka.com renders as
// /docs/orazaka/ui/<name>, and `scripts/registry.test.mjs` fails when an exported component has none.

/** Every documented component of the kit. */
export type ComponentName =
  | "badge"
  | "button"
  | "chat-showcase"
  | "clip-player"
  | "command-palette"
  | "icon"
  | "run-facts"
  | "sentinel-mini"
  | "skeleton"
  | "video-result";

/** A component of @krizaka/ui, documented at krizaka.com/docs/ui/<name>: `ui/badge`, `ui/button`. */
export type UiComponent = `ui/${string}`;

/** A component a reader should know about: one of this kit, or one of @krizaka/ui. */
export type Reference = ComponentName | UiComponent;

/** `stable`: its API only changes in a major. `beta`: it may still change in a minor. `deprecated`: see `deprecated`. */
export type Status = "stable" | "beta" | "deprecated";

/** The group of the catalogue (the @krizaka/ui categories). */
export type Category =
  "actions" | "forms" | "navigation" | "overlays" | "feedback" | "data-display" | "layout" | "foundations";

/** A named example: `registry/examples/<component>/<name>.tsx` — at most 40 lines, a realistic product scenario. */
export interface Example {
  /** The file name, kebab-case (`sovereign-answer`). */
  readonly name: string;
  /** A short title (`A sovereign answer`). */
  readonly title: string;
  /** One or two sentences: the situation it shows. */
  readonly description: string;
}

export interface KeyboardInteraction {
  readonly keys: string;
  readonly action: string;
}

export interface ComponentMeta {
  /** The display name: `Chat showcase`. */
  readonly title: string;
  /** One sentence: what it is. */
  readonly summary: string;
  /** Why it exists above Krizaka UI: what the primitive alone does not say about Orazaka. */
  readonly why: string;
  readonly status: Status;
  /** Required when `status` is `deprecated`: since when, what replaces it, when it goes. */
  readonly deprecated?: { readonly since: string; readonly use: Reference; readonly removedIn: string };
  readonly category: Category;
  /** The kit's components are web components; the mobile app takes the tokens (`@krizaka/orazaka-shared`). */
  readonly platforms: "web";
  /** The @krizaka/ui components it is built on (`ui/command`): a product component composes, it never copies. */
  readonly builtOn: readonly UiComponent[];
  readonly whenToUse: readonly string[];
  readonly whenNotToUse: readonly { readonly when: string; readonly use?: Reference }[];
  readonly bestPractices: readonly string[];
  readonly accessibility: { readonly keyboard: readonly KeyboardInteraction[]; readonly notes: readonly string[] };
  readonly related: readonly Reference[];
  readonly web: {
    /** The names to import. */
    readonly imports: readonly string[];
    /** The entry they come from: `.` (the package root, the only one). */
    readonly entry?: ".";
    /** The examples, in reading order; the first one is the preview. Empty only for a deprecated component. */
    readonly examples: readonly Example[];
  };
}
