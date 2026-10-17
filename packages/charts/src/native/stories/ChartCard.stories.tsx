import type { Meta, StoryObj } from "@storybook/react-vite";

import EarningsExample from "../../../registry/examples/chart-card/native/earnings";
import { chartsNativeFrame } from "./frame";

/** Native — ChartCard. Each story renders a named example of the registry: the code ui.krizaka.com shows. */
const meta = { title: "Charts Native/ChartCard", decorators: [chartsNativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Earnings: Story = { render: () => <EarningsExample /> };
