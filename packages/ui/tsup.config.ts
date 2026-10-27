import { defineConfig, type Options } from "tsup";

/**
 * ESM + types, one entry per primitive, in three groups (study §2.8):
 * - server: no directive — no hook, no context: usable in a Server Component as they are;
 * - client: a "use client" banner on every file (the marks and the motion, avatar, theme, countdown, and everything
 *   that opens in a portal: dialog, toast, popover, dropdown-menu, tooltip; and every control with a state or a context: tabs, chip, switch,
 *   slider, checkbox, radio-group, command, confirm-button);
 * - native: React Native (react-native-svg), no directive, never loads react-dom. @krizaka/tokens/native is inlined (its
 *   values; the types are declared in src/native/theme.tsx and checked against it): /native adds no dependency to an
 *   app — tokens, tailwind and ui share one version anyway;
 * - examples: the registry's named examples (`registry/examples/<name>/<example>.tsx`, and `…/native/<example>.tsx`
 *   for React Native → `.js` + `.d.ts` beside them), client, importing the primitives through the package's own
 *   entries (`@krizaka/ui/<name>`, `@krizaka/ui/native`, external): one copy of each primitive.
 * `dist/` is emptied by the build script, not by tsup: the three builds run side by side.
 */
// The router's context (`RouteStateProvider`) must be one module in the whole package: the builds below are separate
// esbuild runs, and a block of one group that bundled its own copy of `../router` would read its own context, never the
// adapter an app gives `@krizaka/ui/router`'s provider (a Next.js app's `routeKey` would silently fall back to the
// browser's history). Every `../router` outside src/router is therefore the package's own entry, external.
const oneRouter: NonNullable<Options["esbuildPlugins"]>[number] = {
  name: "krizaka-one-router",
  setup(build) {
    build.onResolve({ filter: /^\.\.\/router$/ }, (args) =>
      args.importer.includes("/src/router/") ? undefined : { path: "@krizaka/ui/router", external: true },
    );
  },
};

const shared = {
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: false,
  external: ["react", "react-dom", "react/jsx-runtime"],
  esbuildPlugins: [oneRouter],
} satisfies Options;

export default defineConfig([
  {
    ...shared,
    entry: {
      cn: "src/cn.ts",
      slot: "src/slot/index.ts",
      button: "src/button/index.ts",
      badge: "src/badge/index.ts",
      field: "src/field/index.ts",
      skeleton: "src/skeleton/index.ts",
      "empty-state": "src/empty-state/index.ts",
      "update-prompt": "src/update-prompt/index.ts",
      "force-update-screen": "src/force-update-screen/index.ts",
      "maintenance-screen": "src/maintenance-screen/index.ts",
      spinner: "src/spinner/index.ts",
      card: "src/card/index.ts",
      stat: "src/stat/index.ts",
      "kpi-explained": "src/kpi-explained/index.ts",
      "page-header": "src/page-header/index.ts",
      // One day's appointments, with a « now » line.
      agenda: "src/agenda/index.ts",
      // Space or time used against a plan.
      "quota-meter": "src/quota-meter/index.ts",
      // The « development version » band, driven by the deployment's stage.
      "environment-notice": "src/environment-notice/index.ts",
      // The clients' word on a shop: a score as a stamp, five meters, the review cards.
      reviews: "src/reviews/index.ts",
      "margin-layout": "src/margin-layout/index.ts",
      // The blocks of a « Credits & usage » page.
      usage: "src/usage/index.ts",
      // The result of an AI analysis: summary, findings, limits, provenance.
      "analysis-report": "src/analysis-report/index.ts",
      alert: "src/alert/index.ts",
      separator: "src/separator/index.ts",
      kbd: "src/kbd/index.ts",
      progress: "src/progress/index.ts",
      waveform: "src/waveform/index.ts",
      "section-backdrop": "src/section-backdrop/index.ts",
      iso: "src/iso/index.ts",
      stepper: "src/stepper/index.ts",
      "chip-link": "src/chip-link/index.ts",
      "chip-row": "src/chip-row/index.ts",
      meter: "src/meter/index.ts",
      pagination: "src/pagination/index.ts",
      "description-list": "src/description-list/index.ts",
      "meta-row": "src/meta-row/index.ts",
      // The header beside a RailNav: the name as text, the mark below md (server-safe).
      "app-header": "src/app-header/index.ts",
      // A shop's storefront: the service card and the weekly hours (server-safe).
      "service-card": "src/service-card/index.ts",
      "opening-hours": "src/opening-hours/index.ts",
      "verified-badge": "src/verified-badge/index.ts",
      "step-progress": "src/step-progress/index.ts",
      // The default avatars' pure helpers (defaultAvatarUrl…): callable in a Server Component, unlike "avatar" (client).
      "avatar/defaults": "src/avatar/defaults.ts",
      // The Krizaka family as data (the bar's switcher and the footer read it).
      sites: "src/sites/index.ts",
      "nav-bar/me": "src/nav-bar/me.ts",
      // The page blocks that hold no state: usable in a Server Component as they are.
      page: "src/page/index.ts",
      "page-hero": "src/page-hero/index.ts",
      "link-card": "src/link-card/index.ts",
      "argument-card": "src/argument-card/index.ts",
      "decision-list": "src/decision-list/index.ts",
      "action-bar": "src/action-bar/index.ts",
      "next-actions": "src/next-actions/index.ts",
      glossary: "src/glossary/index.ts",
      "cta-panel": "src/cta-panel/index.ts",
      // The Cahier's signature blocks (ADR-004): the specimen tag, the anatomy plate, the index, the small print.
      "specimen-tag": "src/specimen-tag/index.ts",
      // The retro pieces of the Krizaka style, pure SVG (the doodle is below, with Stuck).
      "speed-lines": "src/speed-lines/index.ts",
      "anatomy-plate": "src/anatomy-plate/index.ts",
      "page-index": "src/page-index/index.ts",
      chapter: "src/chapter/index.ts",
      footnote: "src/footnote/index.ts",
      // Stuck into the notebook: the hold, the margin doodle, the house's signature (server-safe).
      stuck: "src/stuck/index.ts",
      doodle: "src/doodle/index.ts",
      signature: "src/signature/index.ts",
      // The recipes: classes of the tokens, read by tv() on the web and by the phone's components (no React).
      recipes: "src/recipes/index.ts",
    },
  },
  {
    // Server too — the layouts that hold no state (the shells of whole screens), in their own build: one declaration
    // build for every server entry would exhaust the heap.
    ...shared,
    entry: {
      "dashboard-layout": "src/dashboard-layout/index.ts",
      "account-settings": "src/account-settings/index.ts",
      "settings-layout": "src/settings-layout/index.ts",
      "drop-overlay": "src/drop-overlay/index.ts",
      "upload-queue": "src/upload-queue/index.ts",
      "account-menu": "src/account-menu/index.ts",
      "auth-layout": "src/auth-layout/index.ts",
      "detail-layout": "src/detail-layout/index.ts",
      "split-view": "src/split-view/index.ts",
      "marketing-layout": "src/marketing-layout/index.ts",
      "docs-layout": "src/docs-layout/index.ts",
      "docs-nav": "src/docs-nav/index.ts",
    },
  },
  {
    // Server — the page templates: whole pages composed of the blocks and layouts, which they import through the
    // package's own entries (external), so a block's client boundary ("use client") stays where it is.
    ...shared,
    entry: {
      "landing-page": "src/landing-page/index.ts",
      "product-page": "src/product-page/index.ts",
      "how-it-works-page": "src/how-it-works-page/index.ts",
      "gallery-page": "src/gallery-page/index.ts",
      "docs-hub-page": "src/docs-hub-page/index.ts",
      "docs-article-page": "src/docs-article-page/index.ts",
      "component-page": "src/component-page/index.ts",
      "catalogue-page": "src/catalogue-page/index.ts",
      "longform-page": "src/longform-page/index.ts",
      "changelog-page": "src/changelog-page/index.ts",
      "contact-page": "src/contact-page/index.ts",
      "legal-page": "src/legal-page/index.ts",
      "status-page": "src/status-page/index.ts",
      "error-page": "src/error-page/index.ts",
      "pricing-page": "src/pricing-page/index.ts",
    },
    external: [...shared.external, /^@krizaka\/ui(\/|$)/],
  },
  {
    // Server — the shop page (ADR-007): the document (`shop`: schema, catalogue, migrations, the frame) and one entry per
    // section type. The blocks they draw (the cover, the TV, the wall, the phone bar) are imported through the package's
    // own entries (external), so a client boundary stays where it is.
    ...shared,
    entry: {
      shop: "src/shop/index.ts",
      "shop/hero": "src/shop/hero/index.ts",
      "shop/services": "src/shop/services/index.ts",
      "shop/booking": "src/shop/booking/index.ts",
      "shop/gallery": "src/shop/gallery/index.ts",
      "shop/demo": "src/shop/demo/index.ts",
      "shop/video": "src/shop/video/index.ts",
      "shop/reviews": "src/shop/reviews/index.ts",
      "shop/bulletin": "src/shop/bulletin/index.ts",
      "shop/team": "src/shop/team/index.ts",
      "shop/visit": "src/shop/visit/index.ts",
      "shop/story": "src/shop/story/index.ts",
      "shop/social": "src/shop/social/index.ts",
      "shop/faq": "src/shop/faq/index.ts",
      "shop/policies": "src/shop/policies/index.ts",
    },
    external: [...shared.external, /^@krizaka\/ui(\/|$)/, "zod", /^zod\//],
  },
  {
    // Client — the shop's map gate (a still, the live map behind a button on a phone) and its composer (ADR-007 §5): the outline,
    // the inspector, the history, the publish diff. Separate entries, never in a public page's bundle; the blocks they draw are
    // imported through the package's own entries (external), the shop's sections by relative path (one copy in the composer).
    ...shared,
    entry: {
      "shop/map-gate": "src/shop/map-gate/index.ts",
      "shop-composer": "src/shop-composer/index.ts",
    },
    external: [...shared.external, /^@krizaka\/ui(\/|$)/, "zod", /^zod\//],
    banner: { js: '"use client";' },
  },
  {
    // Client — the page blocks with a hook (the pointer's light, the bird's id, the copy button, the reading position).
    ...shared,
    entry: {
      "card-grid": "src/card-grid/index.ts",
      "pointer-light": "src/pointer-light/index.ts",
      "mascot-quote": "src/mascot-quote/index.ts",
      // The bird plate: each bird has an id per instance (Mascot).
      "bird-plate": "src/bird-plate/index.ts",
      "taped-photo": "src/taped-photo/index.ts",
      "grade-stamp": "src/grade-stamp/index.ts",
      "versus-card": "src/versus-card/index.ts",
      // The tool sites' template: the Cahier, the site's bird and hue.
      "site-cahier": "src/site-cahier/index.ts",
      flock: "src/flock/index.ts",
      elephant: "src/elephant/index.ts",
      "code-block": "src/code-block/index.ts",
      toc: "src/toc/index.ts",
      // The application shell: its collapse and its drawer (Radix Dialog).
      "app-shell": "src/app-shell/index.ts",
      // The compact rail (a bottom tab bar on a phone): its expand state, its arrow keys and its tooltips.
      "rail-nav": "src/rail-nav/index.ts",
      // The next free times: the chosen day is its state.
      "slot-picker": "src/slot-picker/index.ts",
      // The shop's cover and its gallery: loops that stop under reduced motion.
      "cover-hero": "src/cover-hero/index.ts",
      wall: "src/wall/index.ts",
      "media-gallery": "src/media-gallery/index.ts",
      // The skip link moves focus to its target.
      "skip-link": "src/skip-link/index.ts",
      // The top bar's search trigger: its global ⌘K (the bar itself, ./app-header, stays server-safe).
      "app-header/search": "src/app-header/search/index.ts",
    },
    banner: { js: '"use client";' },
  },
  {
    ...shared,
    entry: {
      index: "src/index.ts",
      avatar: "src/avatar/index.ts",
      theme: "src/theme/index.ts",
      countdown: "src/countdown/index.ts",
      captcha: "src/captcha/index.ts",
      dialog: "src/dialog/index.ts",
      toast: "src/toast/index.ts",
      popover: "src/popover/index.ts",
      "dropdown-menu": "src/dropdown-menu/index.ts",
      tooltip: "src/tooltip/index.ts",
      "glossary-term": "src/glossary-term/index.ts",
      tabs: "src/tabs/index.ts",
      router: "src/router/index.ts",
      // What reaches a person: categories by channels.
      "notification-preferences": "src/notification-preferences/index.ts",
      chip: "src/chip/index.ts",
      // A state of a status set, with its menu of moves.
      "status-chip": "src/status-chip/index.ts",
      // The admin's editors of a kind's tags and statuses.
      "kind-config-editor": "src/kind-config-editor/index.ts",
      switch: "src/switch/index.ts",
      slider: "src/slider/index.ts",
      checkbox: "src/checkbox/index.ts",
      "radio-group": "src/radio-group/index.ts",
      command: "src/command/index.ts",
      "confirm-button": "src/confirm-button/index.ts",
      mascots: "src/mascots/index.ts",
      "mascot-state": "src/mascot-state/index.ts",
      motion: "src/motion/index.ts",
      loader: "src/loader/index.ts",
      "nav-bar": "src/nav-bar/index.ts",
      "language-switch": "src/language-switch/index.ts",
      // The footer of the family's sites (its marks hold an id).
      "site-footer": "src/site-footer/index.ts",
      "number-ticker": "src/number-ticker/index.ts",
      "glow-card": "src/glow-card/index.ts",
      marquee: "src/marquee/index.ts",
      // The engine and the apps it serves: conduits and photons in SVG + CSS (motion.css), a node chosen by hover or focus.
      "engine-flow": "src/engine-flow/index.ts",
      "comparison-table": "src/comparison-table/index.ts",
      showcase: "src/showcase/index.ts",
      "step-showcase": "src/step-showcase/index.ts",
      "terminal-replay": "src/terminal-replay/index.ts",
    },
    banner: { js: '"use client";' },
  },
  {
    // Client too — the data and media primitives, in their own build: one declaration build for every client entry
    // would exhaust the heap.
    ...shared,
    entry: {
      "data-table": "src/data-table/index.ts",
      // Data-driven UI (ADR-082): its base catalog draws a DataTable.
      genui: "src/genui/index.ts",
      virtual: "src/virtual/index.ts",
      "filter-bar": "src/filter-bar/index.ts",
      combobox: "src/combobox/index.ts",
      "tag-input": "src/tag-input/index.ts",
      "date-picker": "src/date-picker/index.ts",
      "search-field": "src/search-field/index.ts",
      "video-player": "src/video-player/index.ts",
      "retro-tv": "src/retro-tv/index.ts",
      // Client since krizaka-ui#608: it hides while the page's own action is on screen.
      "sticky-action": "src/sticky-action/index.ts",
      // A platform's short video behind a click (Law 25); fits a RetroTv's screen.
      "embed-facade": "src/embed-facade/index.ts",
      "vertical-video": "src/vertical-video/index.ts",
      "file-upload": "src/file-upload/index.ts",
      "media-capture": "src/media-capture/index.ts",
      "video-trimmer": "src/video-trimmer/index.ts",
      "audio-player": "src/audio-player/index.ts",
      "image-cropper": "src/image-cropper/index.ts",
      "document-viewer": "src/document-viewer/index.ts",
      list: "src/list/index.ts",
      "activity-feed": "src/activity-feed/index.ts",
      "tree-view": "src/tree-view/index.ts",
      kanban: "src/kanban/index.ts",
      "media-grid": "src/media-grid/index.ts",
      "photo-grid": "src/photo-grid/index.ts",
      "swipe-deck": "src/swipe-deck/index.ts",
      "match-dialog": "src/match-dialog/index.ts",
      "tag-selector": "src/tag-selector/index.ts",
      "chat": "src/chat/index.ts",
    },
    banner: { js: '"use client";' },
  },
  {
    // Client — the form (TanStack Form v1 behind the facade): its fields are adapters over the primitives, which they
    // import through the package's own entries (external) — one copy of each primitive, swapped without touching a form.
    ...shared,
    entry: { form: "src/form/index.ts", "text-style": "src/text-style/index.ts" },
    external: [...shared.external, /^@krizaka\/ui(\/|$)/],
    banner: { js: '"use client";' },
  },
  {
    // Server — Markdown (TanStack Markdown): no hook, no directive; its code blocks are the client `code-block` entry,
    // imported through the package's own entry (external) so the client boundary stays where it is.
    ...shared,
    entry: { markdown: "src/markdown/index.ts" },
    external: [...shared.external, /^@krizaka\/ui(\/|$)/],
  },
  {
    // Client — the map (MapLibre GL JS and PMTiles loaded on demand, optional peers): the style is generated from the
    // tokens, inlined like /native's.
    ...shared,
    entry: { map: "src/map/index.ts" },
    external: [...shared.external, "maplibre-gl", "pmtiles", "@protomaps/basemaps"],
    noExternal: ["@krizaka/tokens"],
    banner: { js: '"use client";' },
  },
  {
    // Server — the form's server side (a Server Action re-validating with the form's schema): no React, no directive.
    ...shared,
    entry: { "form/server": "src/form/server.ts", "text-style/server": "src/text-style/server.ts" },
  },
  {
    // Server — the language helpers (`languagesFor`, `languageHref`, `languageNames`): pure functions, usable in a Server Component
    // (`@krizaka/ui/language-switch` is a client module: its banner would make them unimportable there).
    ...shared,
    entry: { "language-switch/server": "src/language-switch/server.ts" },
  },
  {
    // The storytelling kit (story.css) without a hook: usable in a Server Component as it is.
    ...shared,
    entry: {
      "profile-card": "src/profile-card/index.ts",
      "stage-banner": "src/stage-banner/index.ts",
      "goal-gauge": "src/goal-gauge/index.ts",
      "continue-prompt": "src/continue-prompt/index.ts",
      achievement: "src/achievement/index.ts",
      "promise-card": "src/promise-card/index.ts",
    },
  },
  {
    // Client — the storytelling kit's conductor, the selectable grid and the landscape (an id per instance).
    ...shared,
    entry: {
      "scroll-stage": "src/scroll-stage/index.ts",
      "choice-grid": "src/choice-grid/index.ts",
      landscape: "src/landscape/index.ts",
    },
    banner: { js: '"use client";' },
  },
  {
    ...shared,
    entry: { native: "src/native/index.ts" },
    external: [...shared.external, "react-native", "react-native-svg"],
    noExternal: ["@krizaka/tokens"],
  },
  {
    // The native entries that need a module of their own (an optional peer): their own files, importing the platform
    // through `@krizaka/ui/native` (one theme context) and the module itself — never part of dist/native.js. The list
    // takes FlashList and @krizaka/query (one QueryClient context: the app's).
    ...shared,
    entry: {
      "native/video-player": "src/native/video-player.tsx",
      "native/vertical-video": "src/native/vertical-video.tsx",
      "native/media-capture": "src/native/media-capture.tsx",
      "native/media-picker": "src/native/media-picker.tsx",
      "native/list": "src/native/list.tsx",
      // The form: TanStack Form (a dependency, as on the web) on the native fields of @krizaka/ui/native.
      "native/form": "src/native/form.tsx",
      // The map: MapLibre Native (an optional peer) with the web's style, generated from the tokens (inlined).
      "native/map": "src/native/map.tsx",
      // Markdown: TanStack Markdown and the code grammars (dependencies, as on the web), drawn in Text and View.
      "native/markdown": "src/native/markdown.tsx",
    },
    external: [...shared.external, /^@krizaka\/ui(\/|$)/, "react-native", "react-native-svg", "expo-video", "expo-camera", "expo-image-picker", "@shopify/flash-list", "@krizaka/query", "@maplibre/maplibre-react-native", "@protomaps/basemaps"],
    noExternal: ["@krizaka/tokens"],
  },
  {
    ...shared,
    entry: ["registry/examples/**/*.tsx"],
    outDir: "registry/examples",
    sourcemap: false,
    // ~170 entries: one declaration build would exhaust the heap. Every example has the same signature — a component,
    // `defaultOpen` for those that open something — so build-registry.mjs writes their `.d.ts`.
    dts: false,
    external: [...shared.external, /^@krizaka\/ui(\/|$)/, "react-native", "react-native-svg", "expo-video", "expo-camera", "expo-image-picker", "@shopify/flash-list", "@krizaka/query", "zod", "@maplibre/maplibre-react-native"],
    banner: { js: '"use client";' },
  },
]);
