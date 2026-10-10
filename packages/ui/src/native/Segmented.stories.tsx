import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { View } from "react-native";

import { Segmented } from "./segmented";
import { nativeFrame } from "./story-frame";

const options = [
  { value: "feed", label: "Feed" },
  { value: "auctions", label: "Auctions" },
  { value: "challenges", label: "Challenges" },
] as const;

/** Native — switches between views of a screen (the web `Tabs variant="segmented"`): a tab list. */
const meta = {
  title: "Native/Segmented",
  component: Segmented,
  decorators: [nativeFrame],
  args: { options: [...options], value: "feed", onValueChange: () => undefined, "aria-label": "View" },
} satisfies Meta<typeof Segmented>;
export default meta;

type Story = StoryObj<typeof meta>;

function Controlled({ size }: { size?: "sm" | "md" }) {
  const [value, setValue] = React.useState<(typeof options)[number]["value"]>("auctions");
  return (
    <View style={{ width: 320 }}>
      <Segmented aria-label="View" options={options} value={value} onValueChange={setValue} size={size} />
    </View>
  );
}

export const Default: Story = { render: () => <Controlled /> };

export const Small: Story = { render: () => <Controlled size="sm" /> };
