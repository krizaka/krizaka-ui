import type { Meta, StoryObj } from "@storybook/react-vite";

import CentredExample from "../../registry/examples/slider/centred";
import DefaultExample from "../../registry/examples/slider/default";
import DisabledExample from "../../registry/examples/slider/disabled";
import RangeExample from "../../registry/examples/slider/range";
import WithLabelExample from "../../registry/examples/slider/with-label";
import { Slider } from "./slider";

/**
 * `Slider` on Radix: one value or a range, arrows / Page Up / Page Down / Home / End.
 * Each story renders a named example of the registry (`registry/examples/slider/*`): the code krizaka.com/docs/ui shows.
 */
const meta = {
  title: "Primitives/Slider",
  component: Slider,
  args: { label: "Volume" },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Slider>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <DefaultExample /> };
export const WithLabel: Story = { render: () => <WithLabelExample /> };
export const Centred: Story = { render: () => <CentredExample /> };
export const Range: Story = { render: () => <RangeExample /> };
export const Disabled: Story = { render: () => <DisabledExample /> };
