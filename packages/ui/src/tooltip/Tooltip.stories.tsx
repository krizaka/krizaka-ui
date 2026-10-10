import type { Meta, StoryObj } from "@storybook/react-vite";

import RightExample from "../../registry/examples/tooltip/right";
import TopExample from "../../registry/examples/tooltip/top";
import { Tooltip } from "./tooltip";

/**
 * `Tooltip` on Radix: on hover after `delayDuration`, on keyboard focus at once, dismissed by Escape. Each story
 * renders a named example of the registry (`registry/examples/tooltip/*`), open at load.
 */
const meta = {
  title: "Primitives/Tooltip",
  component: Tooltip,
  args: { content: "Copy the link", children: null },
  parameters: { capture: "viewport" },
  decorators: [
    (Story) => (
      <div className="flex min-h-40 items-center justify-center">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tooltip>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Top: Story = { render: () => <TopExample defaultOpen /> };
export const Right: Story = { render: () => <RightExample defaultOpen /> };
