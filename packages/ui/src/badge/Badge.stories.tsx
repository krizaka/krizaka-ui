import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge } from "./badge";

/** A short status. `tone` × `size`, an optional `dot` (pulsing with `pulse`); the tone is exposed as `data-tone`. */
const meta = {
  title: "Primitives/Badge",
  component: Badge,
  args: { children: "New" },
} satisfies Meta<typeof Badge>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Neutral: Story = {};

export const Accent: Story = { args: { tone: "accent", dot: true } };

export const Success: Story = { args: { tone: "success", dot: true, children: "Paid" } };

export const Warning: Story = { args: { tone: "warning", dot: true, children: "Pending" } };

export const Danger: Story = { args: { tone: "danger", dot: true, pulse: true, children: "Ends soon" } };

/** On a media: the veil and the text are invariant, identical in both themes. */
export const Scrim: Story = {
  args: { tone: "scrim", children: "4K" },
  render: (args) => (
    <div className="flex h-24 w-40 items-start bg-media p-2.5">
      <Badge {...args} />
    </div>
  ),
};

/** `size="md"`. */
export const Medium: Story = { args: { tone: "accent", size: "md", children: "Featured" } };
