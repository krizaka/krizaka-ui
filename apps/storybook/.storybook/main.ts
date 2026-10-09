import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

/** The catalogue of the platform: the stories live next to the primitives, in packages/ui/src. */
const config: StorybookConfig = {
  framework: { name: "@storybook/react-vite", options: {} },
  stories: ["../src/**/*.mdx", "../../../packages/ui/src/**/*.stories.tsx"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y", "@storybook/addon-themes"],
  core: { disableTelemetry: true },
  // The public home of the catalogue is the Bunny mirror; every version and the Pages copy point search engines to it.
  managerHead: (head) => `${head}\n<link rel="canonical" href="https://ui.krizaka.com/latest/" />`,
  viteFinal: async (vite) => ({ ...vite, plugins: [...(vite.plugins ?? []), react(), tailwindcss()] }),
};

export default config;
