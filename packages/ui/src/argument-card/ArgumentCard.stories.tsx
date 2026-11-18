import type { Meta, StoryObj } from "@storybook/react-vite";

import BuildingBlockExample from "../../registry/examples/argument-card/building-block";
import GridExample from "../../registry/examples/argument-card/grid";
import HoverQuietExample from "../../registry/examples/argument-card/hover-quiet";
import UnfoldExample from "../../registry/examples/argument-card/unfold";
import { ArgumentCard } from "./argument-card";
import { expectQuietHover } from "../quiet-hover.story-check";

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
/** The hover of every card: its surface and hairline go one step up, a ring when a link inside takes the focus. */
export const HoverQuiet: Story = {
  render: () => <HoverQuietExample />,
  play: ({ canvasElement }) => expectQuietHover(canvasElement, ".kz-arg"),
};
