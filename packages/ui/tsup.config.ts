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
const shared = {
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: false,
  external: ["react", "react-dom", "react/jsx-runtime"],
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
      "page-header": "src/page-header/index.ts",
      alert: "src/alert/index.ts",
      separator: "src/separator/index.ts",
      kbd: "src/kbd/index.ts",
      progress: "src/progress/index.ts",
      waveform: "src/waveform/index.ts",
      "section-backdrop": "src/section-backdrop/index.ts",
      iso: "src/iso/index.ts",
      stepper: "src/stepper/index.ts",
      "chip-link": "src/chip-link/index.ts",
      meter: "src/meter/index.ts",
      pagination: "src/pagination/index.ts",
      "description-list": "src/description-list/index.ts",
      "meta-row": "src/meta-row/index.ts",
      // The header beside a RailNav: the name as text, the mark below md (server-safe).
      "app-header": "src/app-header/index.ts",
      // A shop's storefront: the service card and the weekly hours (server-safe).
      "service-card": "src/service-card/index.ts",
      "opening-hours": "src/opening-hours/index.ts",
      "sticky-action": "src/sticky-action/index.ts",
      "verified-badge": "src/verified-badge/index.ts",
      "step-progress": "src/step-progress/index.ts",
      // The default avatars' pure helpers (defaultAvatarUrl…): callable in a Server Component, unlike "avatar" (client).
      "avatar/defaults": "src/avatar/defaults.ts",
      // The Krizaka family as data (the bar's switcher and the footer read it).
      sites: "src/sites/index.ts",
      // The page blocks that hold no state: usable in a Server Component as they are.
      page: "src/page/index.ts",
      "page-hero": "src/page-hero/index.ts",
      "link-card": "src/link-card/index.ts",
      "argument-card": "src/argument-card/index.ts",
      "decision-list": "src/decision-list/index.ts",
      "action-bar": "src/action-bar/index.ts",
      "cta-panel": "src/cta-panel/index.ts",
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
      "settings-layout": "src/settings-layout/index.ts",
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
    // Client — the page blocks with a hook (the pointer's light, the bird's id, the copy button, the reading position).
    ...shared,
    entry: {
      "card-grid": "src/card-grid/index.ts",
      "pointer-light": "src/pointer-light/index.ts",
      "mascot-quote": "src/mascot-quote/index.ts",
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
      "media-gallery": "src/media-gallery/index.ts",
      // The skip link moves focus to its target.
      "skip-link": "src/skip-link/index.ts",
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
      tabs: "src/tabs/index.ts",
      chip: "src/chip/index.ts",
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
    entry: { form: "src/form/index.ts" },
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
    entry: { "form/server": "src/form/server.ts" },
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
