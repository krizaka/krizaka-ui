import type { Meta, StoryObj } from "@storybook/react-vite";

import BarExample from "../../registry/examples/progress/bar";
import BarIndeterminateExample from "../../registry/examples/progress/bar-indeterminate";
import BarSizesExample from "../../registry/examples/progress/bar-sizes";
import BufferExample from "../../registry/examples/progress/buffer";
import RingExample from "../../registry/examples/progress/ring";
import RingIndeterminateExample from "../../registry/examples/progress/ring-indeterminate";
import StatusesExample from "../../registry/examples/progress/statuses";
import StepsExample from "../../registry/examples/progress/steps";
import UploadExample from "../../registry/examples/progress/upload";
import { Progress } from "./progress";

/**
 * `Progress` (server-safe): role="progressbar" named by `label`; `variant` bar · ring, `size` sm · md · lg.
 * Each story renders a named example of the registry (`registry/examples/progress/*`): the code krizaka.com/docs/ui shows.
 */
const meta = {
  title: "Primitives/Progress",
  component: Progress,
  args: { label: "Upload" },
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

export const Upload: Story = { render: () => <UploadExample /> };
export const Steps: Story = { render: () => <StepsExample /> };
export const Buffer: Story = { render: () => <BufferExample /> };
export const Statuses: Story = { render: () => <StatusesExample /> };
export const Bar: Story = { render: () => <BarExample /> };
export const BarSizes: Story = { render: () => <BarSizesExample /> };
export const BarIndeterminate: Story = { render: () => <BarIndeterminateExample /> };
export const Ring: Story = { render: () => <RingExample /> };
export const RingIndeterminate: Story = { render: () => <RingIndeterminateExample /> };
