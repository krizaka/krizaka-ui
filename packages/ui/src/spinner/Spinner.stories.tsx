import type { Meta, StoryObj } from "@storybook/react-vite";

import SpinnerDemo from "../../registry/demos/spinner";
import { Spinner } from "./spinner";

/** An indeterminate wait (`role="status"`, named by `label`). It stops turning under reduced motion. */
const meta = {
  title: "Primitives/Spinner",
  component: Spinner,
  args: { label: "Loading" },
} satisfies Meta<typeof Spinner>;
export default meta;

type Story = StoryObj<typeof meta>;

/** The demo of the registry (`registry/demos/spinner.tsx`). */
export const Default: Story = { render: () => <SpinnerDemo /> };

/** sm · md · lg. */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Spinner {...args} size="sm" />
      <Spinner {...args} size="md" />
      <Spinner {...args} size="lg" />
    </div>
  ),
};

/** The colour follows `className` (here a text role). */
export const Muted: Story = { args: { className: "text-fg-secondary" } };
