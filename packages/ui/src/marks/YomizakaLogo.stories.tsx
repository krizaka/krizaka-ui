import type { Meta, StoryObj } from "@storybook/react-vite";

import { YomizakaLogo } from "./YomizakaLogo";

/** The Yomizaka mark. Decorative by default; `title` makes it an image with an accessible name. */
const meta = {
  title: "Brand/YomizakaLogo",
  component: YomizakaLogo,
  args: { size: 96, animated: true },
} satisfies Meta<typeof YomizakaLogo>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Orbit, scan and breath on (they stop under prefers-reduced-motion). */
export const Animated: Story = {};

/** Still: `animated={false}`. */
export const Still: Story = { args: { animated: false } };

/** Named: an image for assistive technology. */
export const WithTitle: Story = { args: { title: "Yomizaka" } };

/** The small size used in navigation. */
export const Small: Story = { args: { size: 24 } };
