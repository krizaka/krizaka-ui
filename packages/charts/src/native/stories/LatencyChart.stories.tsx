import type { Meta, StoryObj } from "@storybook/react-vite";

import ByCapabilityExample from "../../../registry/examples/latency-chart/native/by-capability";
import { chartsNativeFrame } from "./frame";

/** Native — LatencyChart, a ready-made chart. Each story renders a named example of the registry. */
const meta = { title: "Charts Native/LatencyChart", decorators: [chartsNativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const ByCapability: Story = { render: () => <ByCapabilityExample /> };
