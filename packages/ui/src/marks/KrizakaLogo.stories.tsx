import type { Meta, StoryObj } from "@storybook/react-vite";

import { KrizakaLogo } from "./KrizakaLogo";

/** The Krizaka mark. Decorative by default; `title` makes it an image with an accessible name. */
const meta = {
  title: "Brand/KrizakaLogo",
  component: KrizakaLogo,
  args: { size: 96, animated: true },
} satisfies Meta<typeof KrizakaLogo>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Orbits and pulse on (they stop under prefers-reduced-motion). */
export const Animated: Story = {};

/** Still: `animated={false}`. */
export const Still: Story = { args: { animated: false } };

/** Named: an image for assistive technology. */
export const WithTitle: Story = { args: { title: "Krizaka" } };

/** The small size used in navigation. */
export const Small: Story = { args: { size: 24 } };
