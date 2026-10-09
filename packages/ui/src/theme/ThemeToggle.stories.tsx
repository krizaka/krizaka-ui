import type { Meta, StoryObj } from "@storybook/react-vite";

import { ThemeProvider, ThemeToggle } from "./theme";

/**
 * `ThemeToggle` cycles dark → light → system through `ThemeProvider` (persisted as `kz-theme`, applied as `html.light`).
 * Put `<ThemeScript />` in `<head>` so the page never flashes. Clicking it here changes the catalogue's theme too.
 */
const meta = {
  title: "Primitives/ThemeToggle",
  component: ThemeToggle,
  args: { label: "Change the theme" },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof ThemeToggle>;
export default meta;

type Story = StoryObj<typeof meta>;

/** The default: a ghost icon button. */
export const Default: Story = {};

/** Any button variant and shape. */
export const Secondary: Story = { args: { variant: "secondary", shape: "pill" } };
