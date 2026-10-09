import "./storybook.css"; // @import "tailwindcss"; @import "@krizaka/tailwind"; @import "@krizaka/ui/tailwind.css"; + thèmes produits

import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react-vite";

const preview: Preview = {
  decorators: [
    withThemeByClassName({ themes: { dark: "", light: "light" }, defaultTheme: "dark", parentSelector: "html" }),
    (Story, { globals }) => (
      <div className={globals.brand === "orochia" ? "brand-orochia" : globals.brand === "orazaka" ? "brand-orazaka" : ""}>
        <Story />
      </div>
    ),
  ],
  globalTypes: { brand: { description: "Identité produit", toolbar: { items: ["krizaka", "orochia", "orazaka"], dynamicTitle: true } } },
  initialGlobals: { brand: "krizaka" },
  parameters: { a11y: { test: "error" }, backgrounds: { disable: true } },
};
export default preview;
