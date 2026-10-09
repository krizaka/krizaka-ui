import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { View } from "react-native";

import { Progress } from "./progress";
import { nativeFrame } from "./story-frame";
import { Txt } from "./txt";

/** Native — a bar or a ring in the accent gradient; indeterminate without a value. A `progressbar` for screen readers. */
const meta = {
  title: "Native/Progress",
  component: Progress,
  decorators: [nativeFrame],
  args: { value: 64, label: "Upload" },
} satisfies Meta<typeof Progress>;
export default meta;

type Story = StoryObj<typeof meta>;

/** sm · md · lg. */
export const Bar: Story = {
  render: (args) => (
    <View style={{ width: 320, gap: 16 }}>
      <Progress {...args} size="sm" />
      <Progress {...args} size="md" />
      <Progress {...args} size="lg" />
    </View>
  ),
};

/** A ring with its centre: an amount, a percentage. */
export const Ring: Story = {
  render: () => (
    <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
      <Progress variant="ring" size="sm" value={30} label="Goal" />
      <Progress variant="ring" size="md" value={64} label="Goal">
        <Txt variant="label">64%</Txt>
      </Progress>
      <Progress variant="ring" size="lg" value={420} max={1000} label="Raised towards the goal" valueText="$420 of $1,000">
        <Txt variant="title">$420</Txt>
        <Txt variant="caption" tone="secondary">
          of $1,000
        </Txt>
      </Progress>
    </View>
  ),
};

/** No value: a wait of unknown length (still under reduced motion). */
export const Indeterminate: Story = {
  render: () => (
    <View style={{ width: 320, gap: 16 }}>
      <Progress label="Processing" />
      <Progress variant="ring" label="Processing" />
    </View>
  ),
};
