import type { Meta, StoryObj } from "@storybook/react-vite";

import GroupExample from "../../registry/examples/avatar/native/group";
import SizesExample from "../../registry/examples/avatar/native/sizes";
import { Avatar } from "./avatar";
import { nativeFrame } from "./story-frame";

/**
 * Native — a round picture (`src`, `alt`), the initial or `fallback` without one; `size` xs…xl or points; `Avatar.Group`.
 * Each story renders a named example of the registry (`registry/examples/avatar/native/*`).
 */
const meta = {
  title: "Native/Avatar",
  component: Avatar,
  decorators: [nativeFrame],
  args: { alt: "Maya" },
} satisfies Meta<typeof Avatar>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Sizes: Story = { render: () => <SizesExample /> };
export const Group: Story = { render: () => <GroupExample /> };
