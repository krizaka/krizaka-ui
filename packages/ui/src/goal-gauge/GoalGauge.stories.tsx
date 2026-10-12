import type { Meta, StoryObj } from "@storybook/react-vite";

import ArcadeExample from "../../registry/examples/goal-gauge/arcade";
import ChallengeExample from "../../registry/examples/goal-gauge/challenge";
import DrainExample from "../../registry/examples/goal-gauge/drain";
import { GoalGauge } from "./goal-gauge";

/** GoalGauge — the storytelling kit (story.css): sober by default, `variant="arcade"` opt-in. Each story renders a named example; still in the screenshots (reduced motion). */
const meta = {
  title: "Story/GoalGauge",
  component: GoalGauge,
} satisfies Meta<typeof GoalGauge>;
export default meta;

type Story = StoryObj;

export const Challenge: Story = { render: () => <ChallengeExample /> };
export const Drain: Story = { render: () => <DrainExample /> };
export const Arcade: Story = { render: () => <ArcadeExample /> };
