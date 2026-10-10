import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { View } from "react-native";

import { Button } from "./button";
import { EmptyState } from "./empty-state";
import { Skeleton } from "./skeleton";
import { Spinner } from "./spinner";
import { nativeFrame } from "./story-frame";
import { BellIcon } from "./story-icons";

/** Native — what a screen shows while it waits or when it has nothing: `Skeleton`, `Spinner`, `EmptyState`. */
const meta = {
  title: "Native/Feedback",
  component: EmptyState,
  decorators: [nativeFrame],
  args: { title: "No notifications yet", description: "Follow a creator to hear when they go on stage." },
} satisfies Meta<typeof EmptyState>;
export default meta;

type Story = StoryObj<typeof meta>;

/** `EmptyState`: an icon, a header, a line, an action. */
export const Empty: Story = {
  render: (args) => (
    <View style={{ width: 320 }}>
      <EmptyState {...args} icon={<BellIcon size={24} />} action={<Button variant="primary" label="Explore" />} />
    </View>
  ),
};

/** `Skeleton`: text · circle · rect (still under reduced motion), hidden from screen readers. */
export const Skeletons: Story = {
  render: () => (
    <View style={{ width: 320, gap: 12 }}>
      <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
        <Skeleton shape="circle" />
        <View style={{ flex: 1, gap: 8 }}>
          <Skeleton shape="text" width="60%" />
          <Skeleton shape="text" width="40%" />
        </View>
      </View>
      <Skeleton shape="rect" />
    </View>
  ),
};

/** `Spinner`: the platform's indicator in the accent, named by `label`. sm · md · lg. */
export const Spinners: Story = {
  render: () => (
    <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
      <Spinner label="Loading" size="sm" />
      <Spinner label="Loading" size="md" />
      <Spinner label="Loading" size="lg" />
    </View>
  ),
};
