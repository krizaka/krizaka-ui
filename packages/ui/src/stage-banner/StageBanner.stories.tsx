import type { Meta, StoryObj } from "@storybook/react-vite";

import RoundExample from "../../registry/examples/stage-banner/round";
import StepsExample from "../../registry/examples/stage-banner/steps";
import { StageBanner } from "./stage-banner";

/** StageBanner — the storytelling kit (story.css): sober by default, `variant="arcade"` opt-in. Each story renders a named example; still in the screenshots (reduced motion). */
const meta = {
  title: "Story/StageBanner",
  component: StageBanner,
} satisfies Meta<typeof StageBanner>;
export default meta;

type Story = StoryObj;

export const Steps: Story = { render: () => <StepsExample /> };
export const Round: Story = { render: () => <RoundExample /> };
