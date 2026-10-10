import type { Meta, StoryObj } from "@storybook/react-vite";

import DisabledExample from "../../registry/examples/switch/disabled";
import OffExample from "../../registry/examples/switch/off";
import OnExample from "../../registry/examples/switch/on";
import SmallExample from "../../registry/examples/switch/small";
import WithLabelExample from "../../registry/examples/switch/with-label";
import { Switch } from "./switch";

/**
 * `Switch` on Radix: role="switch", Space toggles. `label` names it when no visible label does.
 * Each story renders a named example of the registry (`registry/examples/switch/*`): the code krizaka.com/docs/ui shows.
 */
const meta = {
  title: "Primitives/Switch",
  component: Switch,
  args: { label: "Autoplay" },
} satisfies Meta<typeof Switch>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Off: Story = { render: () => <OffExample /> };
export const On: Story = { render: () => <OnExample /> };
export const Disabled: Story = { render: () => <DisabledExample /> };
export const Small: Story = { render: () => <SmallExample /> };
export const WithLabel: Story = { render: () => <WithLabelExample /> };
