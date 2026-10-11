import type { Meta, StoryObj } from "@storybook/react-vite";

import PolarUploadsExample from "../../registry/examples/chart/polar-uploads";
import { chartFrame } from "./frame";

/** Chart (ECharts option). Each story renders a named example of the registry: the code krizaka.com/docs/ui shows. */
const meta = { title: "Charts/Chart", decorators: [chartFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const PolarUploads: Story = { render: () => <PolarUploadsExample /> };
