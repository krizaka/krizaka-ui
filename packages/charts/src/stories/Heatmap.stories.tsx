import type { Meta, StoryObj } from "@storybook/react-vite";

import UploadActivityExample from "../../registry/examples/heatmap/upload-activity";
import { chartFrame } from "./frame";

/** Heatmap. Each story renders a named example of the registry: the code ui.krizaka.com shows. */
const meta = { title: "Charts/Heatmap", decorators: [chartFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const UploadActivity: Story = { render: () => <UploadActivityExample /> };
