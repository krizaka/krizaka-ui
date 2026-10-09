import type { Meta, StoryObj } from "@storybook/react-vite";

import ThemeDemo from "../../registry/demos/theme";
import { ThemeProvider, ThemeToggle } from "./theme";

/**
 * `ThemeToggle` cycles dark → light → system through `ThemeProvider` (persisted as `kz-theme`, applied as `html.light`).
 * Put `<ThemeScript />` in `<head>` so the page never flashes. Clicking it here changes the catalogue's theme too.
 */
const meta = {
  title: "Primitives/ThemeToggle",
  component: ThemeToggle,
  args: { label: "Change the theme" },
} satisfies Meta<typeof ThemeToggle>;
export default meta;

type Story = StoryObj<typeof meta>;

/** The default: a ghost icon button, in its provider. The demo of the registry (`registry/demos/theme.tsx`). */
export const Default: Story = { render: () => <ThemeDemo /> };

/** Any button variant and shape. */
export const Secondary: Story = {
  args: { variant: "secondary", shape: "pill" },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
};
