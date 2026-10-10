import type { Meta, StoryObj } from "@storybook/react-vite";

import DefaultExample from "../../registry/examples/segmented/native/default";
import SmallExample from "../../registry/examples/segmented/native/small";
import { Segmented } from "./segmented";
import { nativeFrame } from "./story-frame";

/**
 * Native — switches between views of a screen (the web `Tabs variant="segmented"`): a tab list.
 * Each story renders a named example of the registry (`registry/examples/segmented/native/*`): the code krizaka.com/docs/ui shows.
 */
const meta = {
  title: "Native/Segmented",
  component: Segmented,
  decorators: [nativeFrame],
  args: { options: [{ value: "feed", label: "Feed" }], value: "feed", onValueChange: () => undefined, "aria-label": "View" },
} satisfies Meta<typeof Segmented>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <DefaultExample /> };
export const Small: Story = { render: () => <SmallExample /> };
