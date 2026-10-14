import type { Meta, StoryObj } from "@storybook/react-vite";

import CreditsUsageExample from "../../../registry/examples/area-chart/native/credits-usage";
import { chartsNativeFrame } from "./frame";

/** Native — Area chart. Each story renders a named example of the registry: the code ui.krizaka.com shows. */
const meta = { title: "Charts Native/AreaChart", decorators: [chartsNativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const CreditsUsage: Story = { render: () => <CreditsUsageExample /> };
