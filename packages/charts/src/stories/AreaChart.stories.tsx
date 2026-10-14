import type { Meta, StoryObj } from "@storybook/react-vite";

import CreditsUsageExample from "../../registry/examples/area-chart/credits-usage";
import StorageExample from "../../registry/examples/area-chart/storage";
import { chartFrame } from "./frame";

/** Area chart. Each story renders a named example of the registry: the code ui.krizaka.com shows. */
const meta = { title: "Charts/AreaChart", decorators: [chartFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const CreditsUsage: Story = { render: () => <CreditsUsageExample /> };
export const Storage: Story = { render: () => <StorageExample /> };
