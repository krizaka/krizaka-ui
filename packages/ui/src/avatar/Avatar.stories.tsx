import type { Meta, StoryObj } from "@storybook/react-vite";

import FallbackExample from "../../registry/examples/avatar/fallback";
import GroupExample from "../../registry/examples/avatar/group";
import SizesExample from "../../registry/examples/avatar/sizes";
import WithImageExample from "../../registry/examples/avatar/with-image";
import { Avatar } from "./avatar";

/**
 * A person: their image, or a `fallback` (initials) while it loads, when it fails or when there is none.
 * Each story renders a named example of the registry (`registry/examples/avatar/*`).
 */
const meta = {
  title: "Primitives/Avatar",
  component: Avatar,
} satisfies Meta<typeof Avatar>;
export default meta;

type Story = StoryObj<typeof meta>;

export const WithImage: Story = { render: () => <WithImageExample /> };
export const Fallback: Story = { render: () => <FallbackExample /> };
export const Sizes: Story = { render: () => <SizesExample /> };
export const Group: Story = { render: () => <GroupExample /> };
