import type { Meta, StoryObj } from "@storybook/react-vite";

import PairExample from "../../registry/examples/flock/pair";
import RidgeExample from "../../registry/examples/flock/ridge";
import { Flock } from "./flock";

/** Flock — a Cahier block. Each story renders a named example; the screenshots are still (reduced motion). */
const meta = {
  title: "Blocks/Flock",
  component: Flock,
} satisfies Meta<typeof Flock>;
export default meta;

type Story = StoryObj;

export const Ridge: Story = { render: () => <RidgeExample /> };
export const Pair: Story = { render: () => <PairExample /> };
