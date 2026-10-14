import type { Meta, StoryObj } from "@storybook/react-vite";

import CreditSpendExample from "../../registry/examples/pie-chart/credit-spend";
import StorageByKindExample from "../../registry/examples/pie-chart/storage-by-kind";
import { chartFrame } from "./frame";

/** Pie and donut chart. Each story renders a named example of the registry: the code ui.krizaka.com shows. */
const meta = { title: "Charts/PieChart", decorators: [chartFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const CreditSpend: Story = { render: () => <CreditSpendExample /> };
export const StorageByKind: Story = { render: () => <StorageByKindExample /> };
