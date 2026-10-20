import type { Meta, StoryObj } from "@storybook/react-vite";

import FlockExample from "../../registry/examples/bird-plate/flock";
import SingleExample from "../../registry/examples/bird-plate/single";
import { BirdPlate } from "./bird-plate";

/** BirdPlate — a Cahier block (ADR-004). Each story renders a named example. */
const meta = {
  title: "Blocks/BirdPlate",
  component: BirdPlate,
} satisfies Meta<typeof BirdPlate>;
export default meta;

type Story = StoryObj;

export const Flock: Story = { render: () => <FlockExample /> };
export const Single: Story = { render: () => <SingleExample /> };
