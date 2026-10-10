import type { Meta, StoryObj } from "@storybook/react-vite";

import DefaultExample from "../../registry/examples/empty-state/native/default";
import { EmptyState } from "./empty-state";
import { nativeFrame } from "./story-frame";

/**
 * Native — what a screen shows when it has nothing: an icon, a header, a line, an action. The story renders the
 * registry's example (`registry/examples/empty-state/native/default.tsx`).
 */
const meta = {
  title: "Native/EmptyState",
  component: EmptyState,
  decorators: [nativeFrame],
  args: { title: "No notifications yet" },
} satisfies Meta<typeof EmptyState>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <DefaultExample /> };
