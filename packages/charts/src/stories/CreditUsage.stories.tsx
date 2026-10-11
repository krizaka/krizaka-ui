import type { Meta, StoryObj } from "@storybook/react-vite";

import MonthlyCreditsExample from "../../registry/examples/credit-usage/monthly-credits";
import StoragePlanExample from "../../registry/examples/credit-usage/storage-plan";
import { chartFrame } from "./frame";

/** CreditUsage — a ready-made chart. Each story renders a named example of the registry: the code krizaka.com/docs/ui shows. */
const meta = { title: "Charts/CreditUsage", decorators: [chartFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const MonthlyCredits: Story = { render: () => <MonthlyCreditsExample /> };
export const StoragePlan: Story = { render: () => <StoragePlanExample /> };
