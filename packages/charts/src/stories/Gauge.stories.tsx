import type { Meta, StoryObj } from "@storybook/react-vite";

import ChallengeGoalExample from "../../registry/examples/gauge/challenge-goal";
import CreditsQuotaExample from "../../registry/examples/gauge/credits-quota";
import { chartFrame } from "./frame";

/** Gauge. Each story renders a named example of the registry: the code krizaka.com/docs/ui shows. */
const meta = { title: "Charts/Gauge", decorators: [chartFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const CreditsQuota: Story = { render: () => <CreditsQuotaExample /> };
export const ChallengeGoal: Story = { render: () => <ChallengeGoalExample /> };
