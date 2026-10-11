import type { Meta, StoryObj } from "@storybook/react-vite";

import PublishingExample from "../../registry/examples/calendar-heatmap/publishing";
import { chartFrame } from "./frame";

/** Calendar heatmap. Each story renders a named example of the registry: the code krizaka.com/docs/ui shows. */
const meta = { title: "Charts/CalendarHeatmap", decorators: [chartFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Publishing: Story = { render: () => <PublishingExample /> };
