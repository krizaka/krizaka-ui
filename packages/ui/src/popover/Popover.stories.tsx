import type { Meta, StoryObj } from "@storybook/react-vite";

import PopoverDemo from "../../registry/demos/popover";
import { Popover } from "./popover";

/**
 * `Popover.Root/Trigger/Anchor/Content/Close` on Radix Popover: placed next to its trigger, closed by Escape and an
 * outside click, the focus returned. Content: `bg-surface-2`, a border, `shadow-lg`, the `kz-pop` entrance.
 */
const meta = {
  title: "Primitives/Popover",
  component: Popover.Content,
  parameters: { capture: "viewport" },
  decorators: [
    (Story) => (
      <div className="flex min-h-80 items-start justify-center pt-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Popover.Content>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Open at load: a small form next to its trigger. */
export const Open: Story = { render: () => <PopoverDemo defaultOpen /> };
