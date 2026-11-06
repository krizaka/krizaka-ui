import type { Meta, StoryObj } from "@storybook/react-vite";

import FrenchSovkoraExample from "../../registry/examples/charts-provider/french-sovkora";
import { chartFrame } from "./frame";

/** Charts provider. Each story renders a named example of the registry: the code ui.krizaka.com shows. */
const meta = { title: "Charts/ChartsProvider", decorators: [chartFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const FrenchSovkora: Story = { render: () => <FrenchSovkoraExample /> };
