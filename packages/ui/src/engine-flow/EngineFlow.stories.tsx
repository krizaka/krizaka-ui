import type { Meta, StoryObj } from "@storybook/react-vite";

import CompactExample from "../../registry/examples/engine-flow/compact";
import RadialExample from "../../registry/examples/engine-flow/radial";
import { EngineFlow } from "./engine-flow";

/** An engine at the hub and the apps it serves. Each story renders a named example of the registry. */
const meta = {
  title: "Primitives/EngineFlow",
  component: EngineFlow,
  args: { label: "Orazaka and the products it powers", hub: { label: "Orazaka" }, nodes: [] },
} satisfies Meta<typeof EngineFlow>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Radial: Story = { render: () => <RadialExample /> };
export const Compact: Story = { render: () => <CompactExample /> };
