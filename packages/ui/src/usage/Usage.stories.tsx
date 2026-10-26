import type { Meta, StoryObj } from "@storybook/react-vite";

import CreditsPageExample from "../../registry/examples/usage/credits-page";
import EmptyExample from "../../registry/examples/usage/empty";
import { CreditsMeter } from "./usage";

/**
 * The blocks of a « Credits & usage » page: `CreditsMeter`, `PeriodSwitch`, `UsageTiles`, `UsageChart`.
 * Each story renders a named example of the registry (`registry/examples/usage/*`): the code ui.krizaka.com shows.
 */
const meta = {
  title: "Primitives/Usage",
  component: CreditsMeter,
  args: { label: "Crédits", balance: 820, total: 1000 },
} satisfies Meta<typeof CreditsMeter>;
export default meta;

type Story = StoryObj<typeof meta>;

export const CreditsPage: Story = { render: () => <CreditsPageExample /> };
export const Empty: Story = { render: () => <EmptyExample /> };
