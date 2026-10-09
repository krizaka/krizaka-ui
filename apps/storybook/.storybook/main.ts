import { resolve } from "node:path";

import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

/** The catalogue of the platform: the stories live next to the primitives, in packages/ui/src. */
const ui = resolve(import.meta.dirname, "../../../packages/ui/src");

const config: StorybookConfig = {
  framework: { name: "@storybook/react-vite", options: {} },
  stories: ["../src/**/*.mdx", "../../../packages/ui/src/**/*.stories.tsx"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y", "@storybook/addon-themes"],
  core: { disableTelemetry: true },
  // The public home of the catalogue is the Bunny mirror; every version and the Pages copy point search engines to it.
  managerHead: (head) => `${head}\n<link rel="canonical" href="https://ui.krizaka.com/latest/" />`,
  // The registry's demos (imported by the default stories) import `@krizaka/ui/<primitive>` as a product does: resolved
  // to the sources, like the stories themselves — one copy of each primitive, and live reload.
  viteFinal: async (vite) => ({
    ...vite,
    plugins: [...(vite.plugins ?? []), react(), tailwindcss()],
    resolve: {
      ...vite.resolve,
      alias: [
        ...(Array.isArray(vite.resolve?.alias) ? vite.resolve.alias : Object.entries(vite.resolve?.alias ?? {}).map(([find, replacement]) => ({ find, replacement }))),
        { find: /^@krizaka\/ui\/cn$/, replacement: `${ui}/cn.ts` },
        { find: /^@krizaka\/ui\/([a-z-]+)$/, replacement: `${ui}/$1/index.ts` },
      ],
    },
  }),
};

export default config;
