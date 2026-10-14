import type { Meta, StoryObj } from "@storybook/react-vite";

import CreditSpendExample from "../../../registry/examples/pie-chart/native/credit-spend";
import { chartsNativeFrame } from "./frame";

/** Native — Pie and donut chart. Each story renders a named example of the registry: the code ui.krizaka.com shows. */
const meta = { title: "Charts Native/PieChart", decorators: [chartsNativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const CreditSpend: Story = { render: () => <CreditSpendExample /> };
