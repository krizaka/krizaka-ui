import type { Meta, StoryObj } from "@storybook/react-vite";

import LinkCardExample from "../../registry/examples/glow-card/link-card";
import PlansExample from "../../registry/examples/glow-card/plans";
import SpotlightExample from "../../registry/examples/glow-card/spotlight";
import { GlowCard } from "./glow-card";

/** A card lit by the brand. Each story renders a named example. */
const meta = {
  title: "Primitives/GlowCard",
  component: GlowCard,
} satisfies Meta<typeof GlowCard>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Plans: Story = { render: () => <PlansExample /> };
export const LinkCard: Story = { render: () => <LinkCardExample /> };
export const Spotlight: Story = { render: () => <SpotlightExample /> };
