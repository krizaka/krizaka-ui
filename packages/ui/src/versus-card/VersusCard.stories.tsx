import type { Meta, StoryObj } from "@storybook/react-vite";

import AlternativesExample from "../../registry/examples/versus-card/alternatives";
import ReleasesExample from "../../registry/examples/versus-card/releases";
import { VersusCard } from "./versus-card";

/** VersusCard — a retro block of the Krizaka style. Each story renders a named example. */
const meta = {
  title: "Blocks/VersusCard",
  component: VersusCard,
} satisfies Meta<typeof VersusCard>;
export default meta;

type Story = StoryObj;

export const Releases: Story = { render: () => <ReleasesExample /> };
export const Alternatives: Story = { render: () => <AlternativesExample /> };
