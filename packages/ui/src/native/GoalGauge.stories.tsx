import type { Meta, StoryObj } from "@storybook/react-vite";

import DefaultExample from "../../registry/examples/goal-gauge/native/default";
import { GoalGauge } from "./goal-gauge";
import { nativeFrame } from "./story-frame";

/** Native — the storytelling kit's GoalGauge. The story renders the registry's example (`registry/examples/goal-gauge/native/default.tsx`). */
const meta = {
  title: "Native/GoalGauge",
  component: GoalGauge,
  decorators: [nativeFrame],
} satisfies Meta<typeof GoalGauge>;
export default meta;

type Story = StoryObj;

export const Default: Story = { render: () => <DefaultExample /> };
