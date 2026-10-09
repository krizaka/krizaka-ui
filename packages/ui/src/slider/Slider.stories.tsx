import type { Meta, StoryObj } from "@storybook/react-vite";

import SliderDemo from "../../registry/demos/slider";
import { Slider } from "./slider";

/**
 * `Slider` on Radix: one value or a range, arrows / Page Up / Page Down / Home / End. `label` names the thumb,
 * `formatValue` gives the aria-valuetext and the shown value, `showLabel` shows both above the track, `origin` fills
 * from a centre.
 */
const meta = {
  title: "Primitives/Slider",
  component: Slider,
  args: { label: "Volume", defaultValue: 60 },
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

/** The thumb alone, named by `label`. The demo of the registry (`registry/demos/slider.tsx`). */
export const Default: Story = { render: () => <SliderDemo /> };

/** `showLabel`: the label and the formatted value above the track. */
export const WithLabel: Story = {
  render: () => <Slider label="Speed" showLabel defaultValue={1.5} min={0.5} max={2} step={0.25} formatValue={(v) => `${v}×`} />,
};

/** `origin={0}` on a ±range: the fill starts at the centre. */
export const Centred: Story = {
  render: () => <Slider label="Brightness" showLabel defaultValue={-30} min={-100} max={100} origin={0} formatValue={(v) => `${v > 0 ? "+" : ""}${v} %`} />,
};

/** Two thumbs, each named. */
export const Range: Story = {
  render: () => (
    <Slider<[number, number]>
      label="Price"
      thumbLabels={["Minimum price", "Maximum price"]}
      showLabel
      defaultValue={[10, 60]}
      max={100}
      step={5}
      formatValue={(v) => `$${v}`}
    />
  ),
};

export const Disabled: Story = { args: { disabled: true } };
