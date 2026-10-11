import type { Meta, StoryObj } from "@storybook/react-vite";

import ChallengePotExample from "../../registry/examples/goal-progress/challenge-pot";
import GoalReachedExample from "../../registry/examples/goal-progress/goal-reached";
import { chartFrame } from "./frame";

/** GoalProgress — a ready-made chart. Each story renders a named example of the registry: the code krizaka.com/docs/ui shows. */
const meta = { title: "Charts/GoalProgress", decorators: [chartFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const ChallengePot: Story = { render: () => <ChallengePotExample /> };
export const GoalReached: Story = { render: () => <GoalReachedExample /> };
