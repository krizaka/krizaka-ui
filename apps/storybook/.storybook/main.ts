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

const config: StorybookConfig = {
  framework: { name: "@storybook/react-vite", options: {} },
  stories: ["../src/**/*.mdx", "../../../packages/ui/src/**/*.stories.tsx", "../../../packages/icons/src/**/*.stories.tsx"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y", "@storybook/addon-themes"],
  core: { disableTelemetry: true },
  // The public home of the catalogue is the Bunny mirror; every version and the Pages copy point search engines to it.
  managerHead: (head) => `${head}\n<link rel="canonical" href="https://ui.krizaka.com/latest/" />`,
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
        { find: /^@krizaka\/ui\/cn$/, replacement: `${ui}/cn.ts` },
        { find: /^@krizaka\/ui\/([a-z-]+)$/, replacement: `${ui}/$1/index.ts` },
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
