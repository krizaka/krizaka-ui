import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";

import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// @krizaka/ui/native renders here through react-native-web: `react-native` resolves to it (from any importer, the
// primitives and react-native-svg alike) and `.web.*` files win, so react-native-svg takes its DOM implementation.
// The native stories are then audited and screenshot-compared in dark and light like the web ones.
const reactNativeWeb = join(dirname(createRequire(import.meta.url).resolve("react-native-web/package.json")), "dist", "index.js");
const WEB_FIRST = [".web.tsx", ".web.ts", ".web.mjs", ".web.js", ".mjs", ".js", ".mts", ".ts", ".jsx", ".tsx", ".json"];

/** The catalogue of the platform: the stories live next to the primitives, in packages/ui/src. */
const ui = resolve(import.meta.dirname, "../../../packages/ui/src");
/** @krizaka/charts: its stories render its registry examples, which import the package as a product does. */
const charts = resolve(import.meta.dirname, "../../../packages/charts/src");

const config: StorybookConfig = {
  framework: { name: "@storybook/react-vite", options: {} },
  stories: ["../src/**/*.mdx", "../../../packages/ui/src/**/*.stories.tsx", "../../../packages/icons/src/**/*.stories.tsx", "../../../packages/charts/src/**/*.stories.tsx"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y", "@storybook/addon-themes"],
  core: { disableTelemetry: true },
  // Internal: never deployed (the public documentation is krizaka.com/docs/ui) — kept out of search engines anyway.
  managerHead: (head) => `${head}\n<meta name="robots" content="noindex" />`,
  // The registry's demos (imported by the default stories) import `@krizaka/ui/<primitive>` as a product does: resolved
  // to the sources, like the stories themselves — one copy of each primitive, and live reload.
  viteFinal: async (vite) => ({
    ...vite,
    plugins: [...(vite.plugins ?? []), react(), tailwindcss()],
    define: { ...vite.define, __DEV__: "false" },
    resolve: {
      ...vite.resolve,
      alias: [
        ...toArray(vite.resolve?.alias),
        { find: /^@krizaka\/ui$/, replacement: `${ui}/index.ts` },
        { find: /^@krizaka\/ui\/cn$/, replacement: `${ui}/cn.ts` },
        // The native entries that need an Expo module, and those modules: stand-ins drawn with react-native-web.
        { find: /^@krizaka\/ui\/native\/([a-z-]+)$/, replacement: `${ui}/native/$1.tsx` },
        { find: /^expo-video$/, replacement: `${ui}/native/mocks/expo-video.tsx` },
        { find: /^expo-camera$/, replacement: `${ui}/native/mocks/expo-camera.tsx` },
        { find: /^@maplibre\/maplibre-react-native$/, replacement: `${ui}/native/mocks/maplibre.tsx` },
        { find: /^expo-image-picker$/, replacement: `${ui}/native/mocks/expo-image-picker.tsx` },
        { find: /^@krizaka\/ui\/([a-z-]+)$/, replacement: `${ui}/$1/index.ts` },
        { find: /^@krizaka\/charts$/, replacement: `${charts}/index.ts` },
        { find: /^@krizaka\/charts\/([a-z-]+)$/, replacement: `${charts}/$1/index.ts` },
        { find: /^react-native$/, replacement: reactNativeWeb },
      ],
      extensions: WEB_FIRST,
    },
  }),
};

type Alias = { find: string | RegExp; replacement: string };
function toArray(alias: unknown): Alias[] {
  if (!alias) return [];
  if (Array.isArray(alias)) return alias as Alias[];
  return Object.entries(alias as Record<string, string>).map(([find, replacement]) => ({ find, replacement }));
}

export default config;
