import type { Meta, StoryObj } from "@storybook/react-vite";

import WatchTimeExample from "../../registry/examples/scatter-chart/watch-time";
import { chartFrame } from "./frame";

/** Scatter chart. Each story renders a named example of the registry: the code ui.krizaka.com shows. */
const meta = { title: "Charts/ScatterChart", decorators: [chartFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const WatchTime: Story = { render: () => <WatchTimeExample /> };
