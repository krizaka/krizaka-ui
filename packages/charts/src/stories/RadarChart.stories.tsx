import type { Meta, StoryObj } from "@storybook/react-vite";

import ModelComparisonExample from "../../registry/examples/radar-chart/model-comparison";
import { chartFrame } from "./frame";

/** Radar chart. Each story renders a named example of the registry: the code ui.krizaka.com shows. */
const meta = { title: "Charts/RadarChart", decorators: [chartFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const ModelComparison: Story = { render: () => <ModelComparisonExample /> };
