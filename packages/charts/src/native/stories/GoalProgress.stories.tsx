import type { Meta, StoryObj } from "@storybook/react-vite";

import ChallengePotExample from "../../../registry/examples/goal-progress/native/challenge-pot";
import { chartsNativeFrame } from "./frame";

/** Native — GoalProgress, a ready-made chart. Each story renders a named example of the registry. */
const meta = { title: "Charts Native/GoalProgress", decorators: [chartsNativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const ChallengePot: Story = { render: () => <ChallengePotExample /> };
