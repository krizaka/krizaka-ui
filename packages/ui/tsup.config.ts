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
      spinner: "src/spinner/index.ts",
      card: "src/card/index.ts",
      stat: "src/stat/index.ts",
      "page-header": "src/page-header/index.ts",
      alert: "src/alert/index.ts",
      separator: "src/separator/index.ts",
      kbd: "src/kbd/index.ts",
      progress: "src/progress/index.ts",
      "section-backdrop": "src/section-backdrop/index.ts",
    },
  },
  {
    ...shared,
    entry: {
      index: "src/index.ts",
      avatar: "src/avatar/index.ts",
      theme: "src/theme/index.ts",
      countdown: "src/countdown/index.ts",
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
    ...shared,
    entry: ["registry/examples/**/*.tsx"],
    outDir: "registry/examples",
    sourcemap: false,
    // ~170 entries: one declaration build would exhaust the heap. Every example has the same signature — a component,
    // `defaultOpen` for those that open something — so build-registry.mjs writes their `.d.ts`.
    dts: false,
    external: [...shared.external, /^@krizaka\/ui(\/|$)/, "react-native", "react-native-svg"],
    banner: { js: '"use client";' },
  },
]);
