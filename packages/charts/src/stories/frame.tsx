// Storybook only — neither exported nor built: the frame of the chart stories — a dashboard card's width, on the page
// surface. The theme and the brand come from the toolbar (html.light, `.brand-<id>`), as in a product.
import type { Decorator } from "@storybook/react-vite";

export const chartFrame: Decorator = (Story) => (
  <div style={{ width: 720, maxWidth: "100%", padding: 16, background: "var(--kz-surface-0)" }}>
    <Story />
  </div>
);
