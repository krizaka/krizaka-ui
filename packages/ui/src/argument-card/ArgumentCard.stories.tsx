import type { Meta, StoryObj } from "@storybook/react-vite";

import BuildingBlockExample from "../../registry/examples/argument-card/building-block";
import GridExample from "../../registry/examples/argument-card/grid";
import UnfoldExample from "../../registry/examples/argument-card/unfold";
import { ArgumentCard } from "./argument-card";

/** Argument card — a page block. Each story renders a named example. */
const meta = {
  title: "Blocks/ArgumentCard",
  component: ArgumentCard,
} satisfies Meta<typeof ArgumentCard>;
export default meta;

type Story = StoryObj;

export const BuildingBlock: Story = { render: () => <BuildingBlockExample /> };
export const Grid: Story = { render: () => <GridExample /> };
export const Unfold: Story = { render: () => <UnfoldExample /> };
