import type { Meta, StoryObj } from "@storybook/react-vite";

import StatTrendExample from "../../../registry/examples/sparkline/native/stat-trend";
import { chartsNativeFrame } from "./frame";

/** Native — Sparkline. Each story renders a named example of the registry: the code ui.krizaka.com shows. */
const meta = { title: "Charts Native/Sparkline", decorators: [chartsNativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const StatTrend: Story = { render: () => <StatTrendExample /> };
