import type { Meta, StoryObj } from "@storybook/react-vite";

import ViewersExample from "../../registry/examples/geo-map/viewers";
import { chartFrame } from "./frame";

/** Geo map. Each story renders a named example of the registry: the code ui.krizaka.com shows. */
const meta = { title: "Charts/GeoMap", decorators: [chartFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Viewers: Story = { render: () => <ViewersExample /> };
