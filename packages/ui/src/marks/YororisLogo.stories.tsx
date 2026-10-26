import type { Meta, StoryObj } from "@storybook/react-vite";

import { YororisLogo } from "./YororisLogo";

/** The Yororis mark. Decorative by default; `title` makes it an image with an accessible name. */
const meta = {
  title: "Brand/YororisLogo",
  component: YororisLogo,
  args: { size: 96, animated: true },
} satisfies Meta<typeof YororisLogo>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Orbit and breath on (they stop under prefers-reduced-motion). */
export const Animated: Story = {};

/** Still: `animated={false}`. */
export const Still: Story = { args: { animated: false } };

/** Named: an image for assistive technology. */
export const WithTitle: Story = { args: { title: "Elephant" } };

/** The small size used in navigation. */
export const Small: Story = { args: { size: 24 } };
