import type { Meta, StoryObj } from "@storybook/react-vite";

import SeparatorDemo from "../../registry/demos/separator";
import { Separator } from "./separator";

/** A line between groups (Radix Separator): decorative by default, `decorative={false}` for a real separator. */
const meta = {
  title: "Primitives/Separator",
  component: Separator,
} satisfies Meta<typeof Separator>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Horizontal: Story = { render: () => <SeparatorDemo /> };

export const Vertical: Story = {
  render: (args) => (
    <div className="flex h-6 items-center gap-3 text-sm text-fg-secondary">
      <span>Videos</span>
      <Separator {...args} orientation="vertical" decorative={false} />
      <span>Live</span>
      <Separator {...args} orientation="vertical" decorative={false} />
      <span>Shop</span>
    </div>
  ),
};
