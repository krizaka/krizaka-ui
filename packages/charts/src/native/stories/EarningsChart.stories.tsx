import type { Meta, StoryObj } from "@storybook/react-vite";

import CreatorMonthExample from "../../../registry/examples/earnings-chart/native/creator-month";
import { chartsNativeFrame } from "./frame";

/** Native — EarningsChart, a ready-made chart. Each story renders a named example of the registry. */
const meta = { title: "Charts Native/EarningsChart", decorators: [chartsNativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const CreatorMonth: Story = { render: () => <CreatorMonthExample /> };
