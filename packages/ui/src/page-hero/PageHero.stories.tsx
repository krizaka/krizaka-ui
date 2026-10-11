import type { Meta, StoryObj } from "@storybook/react-vite";

import BuildingBlockExample from "../../registry/examples/page-hero/building-block";
import HubExample from "../../registry/examples/page-hero/hub";
import { PageHero } from "./page-hero";

/** Page hero — a page block. Each story renders a named example. */
const meta = {
  title: "Blocks/PageHero",
  component: PageHero,
} satisfies Meta<typeof PageHero>;
export default meta;

type Story = StoryObj;

export const BuildingBlock: Story = { render: () => <BuildingBlockExample /> };
export const Hub: Story = { render: () => <HubExample /> };
