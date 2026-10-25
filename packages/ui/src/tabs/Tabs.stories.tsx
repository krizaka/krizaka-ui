import type { Meta, StoryObj } from "@storybook/react-vite";

import BinderExample from "../../registry/examples/tabs/binder";
import PillsExample from "../../registry/examples/tabs/pills";
import RoutesExample from "../../registry/examples/tabs/routes";
import SegmentedExample from "../../registry/examples/tabs/segmented";
import UnderlineExample from "../../registry/examples/tabs/underline";
import VerticalExample from "../../registry/examples/tabs/vertical";
import { Tabs } from "./tabs";

/**
 * `Tabs.Root/List/Trigger/Content` on Radix Tabs: roles, roving focus, automatic activation.
 * Each story renders a named example of the registry (`registry/examples/tabs/*`): the code ui.krizaka.com shows.
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
export const Routes: Story = { render: () => <RoutesExample /> };
// Binder dividers (#648): they scroll sideways in a narrow frame, the edges fading; at 360 px on a phone.
export const Binder: Story = { render: () => <BinderExample /> };
export const BinderPhone: Story = { render: () => <BinderExample />, parameters: { phone: true } };
