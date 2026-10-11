// The documentation of a chart, carried by its code: each documented component has a file here (`src/meta/<name>.ts`)
// typed by this module — the same shape as @krizaka/ui's `meta.ts`, so krizaka.com/docs/ui renders both registries
// with one page template. Never built into the package: `scripts/build-registry.mjs` reads them into
// `registry/<name>.json`, and `scripts/registry.test.mjs` fails when one is missing or incomplete. Plain data
// (erasable TypeScript): Node reads it without a compiler.

/** Every documented component of @krizaka/charts. */
export type ComponentName =
  | "line-chart"
  | "area-chart"
  | "bar-chart"
  | "pie-chart"
  | "gauge"
  | "sparkline"
  | "geo-map"
  | "globe"
  | "radar-chart"
  | "heatmap"
  | "calendar-heatmap"
  | "sankey"
  | "funnel"
  | "candlestick"
  | "treemap"
  | "scatter-chart"
  | "chart"
  | "charts-provider"
  | "earnings-chart"
  | "job-throughput"
  | "latency-chart"
  | "credit-usage"
  | "goal-progress"
  | "price-ticker";

/** The entries of the package a component is imported from. */
export type Entry = "earnings" | "throughput" | "latency" | "credits" | "goal" | "ticker" | "line" | "bar" | "pie" | "gauge" | "sparkline" | "geo" | "globe" | "radar" | "heatmap" | "sankey" | "funnel" | "candlestick" | "treemap" | "scatter" | "chart" | "provider";

/** The group of the catalogue: every chart is a `chart`. */
export type Category = "charts";

/** Where a component exists: `@krizaka/charts/<entry>` (web), `@krizaka/charts/native` (React Native), or both. */
export type Platform = "web" | "native" | "both";

/**
 * Where a chart sits in the catalogue — the needs of the Krizaka apps first:
 * - `ready-made`: answers a need of a product screen (earnings, jobs, latency, credits, a goal, an auction's price),
 *   with its formats, words and defaults chosen — reach for these first;
 * - `core`: the general charts the ready-made ones are built on (line, bar, pie, gauge, sparkline), for the rest;
 * - `advanced`: no product screen uses it today (radar, sankey, treemap, the map, the globe…): kept, documented, but
 *   offered last — it needs a reason written in `whenToUse`.
 */
export type Tier = "ready-made" | "core" | "advanced";

/** `stable`: its API only changes in a major. `beta`: it may still change in a minor. */
export type Status = "stable" | "beta";


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
  /** The names to import (`["Button", "IconButton"]`): from `@krizaka/charts/<entry>` on the web, `@krizaka/charts/native` in React Native. */
  readonly imports: readonly string[];
  /** The examples, in reading order; the first one is the component's preview. */
  readonly examples: readonly Example[];
}

/** The web side: the entry it is imported from. */
export interface WebDocs extends PlatformDocs {
  readonly entry: Entry;
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
  /** Where it sits: ready-made for a need, a core chart, or advanced (no product use today). */
  readonly tier: Tier;
  /** Web: drawn in plain SVG (no engine) or on ECharts (loaded when the chart nears the screen). */
  readonly engine?: "svg" | "echarts";
  readonly web?: WebDocs;
  readonly native?: NativeDocs;
}
