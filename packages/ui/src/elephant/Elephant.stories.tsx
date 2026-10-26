import type { Meta, StoryObj } from "@storybook/react-vite";

import { Elephant } from "./elephant";

/** The small elephant of the neighbour joke: standing, or flying on its ears. Decorative by default. */
const meta = {
  title: "Brand/Elephant",
  component: Elephant,
  args: { size: 160 },
} satisfies Meta<typeof Elephant>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Standing: Story = {};

/** The ear spread like a wing; it flaps gently (still under prefers-reduced-motion). */
export const Flying: Story = { args: { pose: "flying" } };

export const FlyingStill: Story = { args: { pose: "flying", animated: false } };

/** Small, as in a chat's closing line. */
export const Small: Story = { args: { size: 32, title: "Elephant" } };
