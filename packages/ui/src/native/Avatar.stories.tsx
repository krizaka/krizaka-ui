import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { View } from "react-native";

import { Avatar } from "./avatar";
import { nativeFrame } from "./story-frame";

/** Native — a round picture (`src`, `alt`), the initial or `fallback` without one; `size` xs…xl or points; `Avatar.Group`. */
const meta = {
  title: "Native/Avatar",
  component: Avatar,
  decorators: [nativeFrame],
  args: { alt: "Maya" },
} satisfies Meta<typeof Avatar>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Without an image: the initial of `alt`. xs · sm · md · lg · xl. */
export const Sizes: Story = {
  render: (args) => (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <Avatar {...args} size="xs" />
      <Avatar {...args} size="sm" />
      <Avatar {...args} size="md" />
      <Avatar {...args} size="lg" />
      <Avatar {...args} size="xl" />
    </View>
  ),
};

/** `Avatar.Group max={3}`: the rest becomes `+n`. */
export const Group: Story = {
  render: () => (
    <Avatar.Group max={3} size="md">
      <Avatar alt="Maya" />
      <Avatar alt="Noor" />
      <Avatar alt="Ines" />
      <Avatar alt="Theo" />
      <Avatar alt="Lou" />
    </Avatar.Group>
  ),
};
