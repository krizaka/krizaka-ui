import type { Meta, StoryObj } from "@storybook/react-vite";

import ArcadeExample from "../../registry/examples/achievement/arcade";
import MilestonesExample from "../../registry/examples/achievement/milestones";
import { Achievement } from "./achievement";

/** Achievement — the storytelling kit (story.css): sober by default, `variant="arcade"` opt-in. Each story renders a named example; still in the screenshots (reduced motion). */
const meta = {
  title: "Story/Achievement",
  component: Achievement,
} satisfies Meta<typeof Achievement>;
export default meta;

type Story = StoryObj;

export const Milestones: Story = { render: () => <MilestonesExample /> };
export const Arcade: Story = { render: () => <ArcadeExample /> };
