import type { Meta, StoryObj } from "@storybook/react-vite";

import BarExample from "../../registry/examples/progress/native/bar";
import IndeterminateExample from "../../registry/examples/progress/native/indeterminate";
import RingExample from "../../registry/examples/progress/native/ring";
import { Progress } from "./progress";
import { nativeFrame } from "./story-frame";

/**
 * Native — a bar or a ring in the accent gradient; indeterminate without a value.
 * Each story renders a named example of the registry (`registry/examples/progress/native/*`): the code krizaka.com/docs/ui shows.
 */
const meta = {
  title: "Native/Progress",
  component: Progress,
  decorators: [nativeFrame],
  args: { label: "Upload" },
} satisfies Meta<typeof Progress>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Bar: Story = { render: () => <BarExample /> };
export const Ring: Story = { render: () => <RingExample /> };
export const Indeterminate: Story = { render: () => <IndeterminateExample /> };
