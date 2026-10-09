import type { Meta, StoryObj } from "@storybook/react-vite";

import { IconButton } from "../button/button";
import { Tooltip } from "./tooltip";

/**
 * `Tooltip` on Radix: on hover after `delayDuration` (300 ms by default), on keyboard focus at once, dismissed by
 * Escape. `content` is passed translated; the trigger keeps its own accessible name.
 */
const meta = {
  title: "Primitives/Tooltip",
  component: Tooltip,
  args: { content: "Copy the link", defaultOpen: true, children: null },
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

const trigger = (
  <IconButton label="Copy" variant="outline">
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  </IconButton>
);

/** Open at load, above its trigger. */
export const Top: Story = { render: (args) => <Tooltip {...args}>{trigger}</Tooltip> };

/** `side="right"`. */
export const Right: Story = { render: (args) => <Tooltip {...args} side="right">{trigger}</Tooltip> };
