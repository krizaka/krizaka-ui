import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../button/button";
import { Field, Input } from "../field/field";
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
export const Open: Story = {
  render: (args) => (
    <Popover.Root defaultOpen>
      <Popover.Trigger asChild>
        <Button variant="outline">Set a goal</Button>
      </Popover.Trigger>
      <Popover.Content {...args} aria-label="Set a goal" align="center">
        <div className="flex flex-col gap-3">
          <Field.Root>
            <Field.Label htmlFor="goal-amount">Amount</Field.Label>
            <Input id="goal-amount" defaultValue="250" />
          </Field.Root>
          <div className="flex justify-end gap-2">
            <Popover.Close asChild>
              <Button size="sm" variant="ghost">
                Cancel
              </Button>
            </Popover.Close>
            <Button size="sm" variant="primary">
              Save
            </Button>
          </div>
        </div>
      </Popover.Content>
    </Popover.Root>
  ),
};
