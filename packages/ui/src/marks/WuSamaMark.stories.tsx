import type { Meta, StoryObj } from "@storybook/react-vite";

import { WuSamaMark } from "./WuSamaMark";

/** The Wu-sama mark, the founder's byline mark: a gold W in the Krizaka hexagon. Original mark, inspired by, not derived from. Decorative by default; `title` makes it an image. */
const meta = {
  title: "Brand/WuSamaMark",
  component: WuSamaMark,
  args: { size: 96 },
} satisfies Meta<typeof WuSamaMark>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Named: an image for assistive technology. */
export const WithTitle: Story = { args: { title: "Wu-sama" } };

/** The byline size, and the favicon size (cropped to the emblem below 48 px). */
export const Small: Story = { args: { size: 24 } };
