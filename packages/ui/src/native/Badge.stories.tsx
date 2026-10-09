import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { View } from "react-native";

import { Badge } from "./badge";
import { nativeFrame } from "./story-frame";
import { useTheme } from "./theme";

/** Native — a short status in capitals: `tone`, `size`, `dot` (pulsing with `pulse`, still under reduced motion). */
const meta = {
  title: "Native/Badge",
  component: Badge,
  decorators: [nativeFrame],
  args: { children: "Live" },
} satisfies Meta<typeof Badge>;
export default meta;

type Story = StoryObj<typeof meta>;

/** neutral · accent · success · warning · danger. */
export const Tones: Story = {
  render: (args) => (
    <View style={{ flexDirection: "row", gap: 8 }}>
      <Badge {...args} tone="neutral" />
      <Badge {...args} tone="accent" />
      <Badge {...args} tone="success" />
      <Badge {...args} tone="warning" />
      <Badge {...args} tone="danger" />
    </View>
  ),
};

/** sm · md, with a dot. */
export const Dot: Story = {
  render: (args) => (
    <View style={{ flexDirection: "row", gap: 8 }}>
      <Badge {...args} tone="danger" dot pulse />
      <Badge {...args} tone="danger" size="md" dot pulse />
    </View>
  ),
};

function OnMedia() {
  const { theme } = useTheme();
  return (
    <View style={{ backgroundColor: theme.media, padding: 24, borderRadius: 12 }}>
      <Badge tone="scrim" dot>
        Ending soon
      </Badge>
    </View>
  );
}

/** `scrim`: on a media, identical in both themes. */
export const Scrim: Story = { render: () => <OnMedia /> };
