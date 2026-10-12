import type { Meta, StoryObj } from "@storybook/react-vite";

import DefaultExample from "../../registry/examples/profile-card/native/default";
import { ProfileCard } from "./profile-card";
import { nativeFrame } from "./story-frame";

/** Native — the storytelling kit's ProfileCard. The story renders the registry's example (`registry/examples/profile-card/native/default.tsx`). */
const meta = {
  title: "Native/ProfileCard",
  component: ProfileCard,
  decorators: [nativeFrame],
} satisfies Meta<typeof ProfileCard>;
export default meta;

type Story = StoryObj;

export const Default: Story = { render: () => <DefaultExample /> };
