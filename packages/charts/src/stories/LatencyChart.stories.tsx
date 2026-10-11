import type { Meta, StoryObj } from "@storybook/react-vite";

import ByCapabilityExample from "../../registry/examples/latency-chart/by-capability";
import TimeToResultExample from "../../registry/examples/latency-chart/time-to-result";
import { chartFrame } from "./frame";

/** LatencyChart — a ready-made chart. Each story renders a named example of the registry: the code krizaka.com/docs/ui shows. */
const meta = { title: "Charts/LatencyChart", decorators: [chartFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const ByCapability: Story = { render: () => <ByCapabilityExample /> };
export const TimeToResult: Story = { render: () => <TimeToResultExample /> };
