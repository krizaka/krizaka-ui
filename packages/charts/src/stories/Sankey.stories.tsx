import type { Meta, StoryObj } from "@storybook/react-vite";

import CreditFlowExample from "../../registry/examples/sankey/credit-flow";
import { chartFrame } from "./frame";

/** Sankey. Each story renders a named example of the registry: the code ui.krizaka.com shows. */
const meta = { title: "Charts/Sankey", decorators: [chartFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const CreditFlow: Story = { render: () => <CreditFlowExample /> };
