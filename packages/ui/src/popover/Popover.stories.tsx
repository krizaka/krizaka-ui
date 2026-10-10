import type { Meta, StoryObj } from "@storybook/react-vite";

import FormExample from "../../registry/examples/popover/form";
import { Popover } from "./popover";

/**
 * `Popover` on Radix Popover: placed next to its trigger, closed by Escape and an outside click. The story renders
 * the registry's example (`registry/examples/popover/form.tsx`), open at load.
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

export const Form: Story = { render: () => <FormExample defaultOpen /> };
