import type { Meta, StoryObj } from "@storybook/react-vite";

import JobsByStatusExample from "../../../registry/examples/bar-chart/native/jobs-by-status";
import { chartsNativeFrame } from "./frame";

/** Native — Bar chart. Each story renders a named example of the registry: the code ui.krizaka.com shows. */
const meta = { title: "Charts Native/BarChart", decorators: [chartsNativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const JobsByStatus: Story = { render: () => <JobsByStatusExample /> };
