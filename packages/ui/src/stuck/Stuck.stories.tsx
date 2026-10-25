import type { Meta, StoryObj } from "@storybook/react-vite";

import CardExample from "../../registry/examples/stuck/card";
import HoldsExample from "../../registry/examples/stuck/holds";
import TagExample from "../../registry/examples/stuck/tag";
import { Stuck } from "./stuck";

/** Stuck — a Cahier block (ADR-004). Each story renders a named example. */
const meta = {
  title: "Blocks/Stuck",
  component: Stuck,
} satisfies Meta<typeof Stuck>;
export default meta;

type Story = StoryObj;

export const Tag: Story = { render: () => <TagExample /> };
export const Card: Story = { render: () => <CardExample /> };
export const Holds: Story = { render: () => <HoldsExample /> };
