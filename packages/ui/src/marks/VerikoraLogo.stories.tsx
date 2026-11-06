import type { Meta, StoryObj } from "@storybook/react-vite";

import { VerikoraLogo } from "./VerikoraLogo";

/** The Verikora mark. Decorative by default; `title` makes it an image with an accessible name. */
const meta = {
  title: "Brand/VerikoraLogo",
  component: VerikoraLogo,
  args: { size: 96, animated: true },
} satisfies Meta<typeof VerikoraLogo>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Orbit and breath on (they stop under prefers-reduced-motion). */
export const Animated: Story = {};

/** Still: `animated={false}`. */
export const Still: Story = { args: { animated: false } };

/** Named: an image for assistive technology. */
export const WithTitle: Story = { args: { title: "Verikora" } };

/** The small size used in navigation. */
export const Small: Story = { args: { size: 24 } };
