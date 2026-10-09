import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

/** The catalogue of the platform: the stories live next to the primitives, in packages/ui/src. */
const config: StorybookConfig = {
  framework: { name: "@storybook/react-vite", options: {} },
  stories: ["../src/**/*.mdx", "../../../packages/ui/src/**/*.stories.tsx"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y", "@storybook/addon-themes"],
  core: { disableTelemetry: true },
  viteFinal: async (vite) => ({ ...vite, plugins: [...(vite.plugins ?? []), react(), tailwindcss()] }),
};

export default config;
