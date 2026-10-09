import type { Meta, StoryObj } from "@storybook/react-vite";

import { Progress } from "./progress";

/**
 * `Progress` (server-safe): role="progressbar" named by `label`, `value` / `max`, `valueText` for the words;
 * indeterminate without a value. `variant` bar · ring, `size` sm · md · lg; a ring holds content in its centre.
 */
const meta = {
  title: "Primitives/Progress",
  component: Progress,
  args: { label: "Upload", value: 64 },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Progress>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Bar: Story = {};

/** sm · md · lg. */
export const BarSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Progress label="Small" size="sm" value={30} />
      <Progress label="Medium" size="md" value={55} />
      <Progress label="Large" size="lg" value={80} />
    </div>
  ),
};

/** A wait of unknown length (still under reduced motion). */
export const BarIndeterminate: Story = { args: { value: null, label: "Processing" } };

/** A ring with its amount in the centre. */
export const Ring: Story = {
  render: () => (
    <div className="flex items-end gap-6">
      <Progress variant="ring" size="sm" label="Profile completed" value={40} />
      <Progress variant="ring" size="md" label="Raised" value={420} max={1000} valueText="$420 of $1,000">
        <span className="text-sm font-bold text-fg">42%</span>
      </Progress>
      <Progress variant="ring" size="lg" label="Raised towards the goal" value={750} max={1000} valueText="$750 of $1,000">
        <span className="font-display text-2xl font-black text-fg">$750</span>
        <span className="text-xs text-fg-secondary">of $1,000</span>
      </Progress>
    </div>
  ),
};

export const RingIndeterminate: Story = {
  render: () => <Progress variant="ring" size="md" label="Loading" />,
};
