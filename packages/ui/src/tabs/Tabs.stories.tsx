import type { Meta, StoryObj } from "@storybook/react-vite";

import PillsExample from "../../registry/examples/tabs/pills";
import SegmentedExample from "../../registry/examples/tabs/segmented";
import UnderlineExample from "../../registry/examples/tabs/underline";
import VerticalExample from "../../registry/examples/tabs/vertical";
import { Tabs } from "./tabs";

/**
 * `Tabs.Root/List/Trigger/Content` on Radix Tabs: roles, roving focus, automatic activation.
 * Each story renders a named example of the registry (`registry/examples/tabs/*`): the code krizaka.com/docs/ui shows.
 */
const meta = {
  title: "Primitives/Tabs",
  component: Tabs.Root,
  decorators: [
    (Story) => (
      <div className="w-[28rem] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tabs.Root>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Underline: Story = { render: () => <UnderlineExample /> };
export const Segmented: Story = { render: () => <SegmentedExample /> };
export const Pills: Story = { render: () => <PillsExample /> };
export const Vertical: Story = { render: () => <VerticalExample /> };
