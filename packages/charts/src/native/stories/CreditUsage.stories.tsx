import type { Meta, StoryObj } from "@storybook/react-vite";

import MonthlyCreditsExample from "../../../registry/examples/credit-usage/native/monthly-credits";
import { chartsNativeFrame } from "./frame";

/** Native — CreditUsage, a ready-made chart. Each story renders a named example of the registry. */
const meta = { title: "Charts Native/CreditUsage", decorators: [chartsNativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const MonthlyCredits: Story = { render: () => <MonthlyCreditsExample /> };
