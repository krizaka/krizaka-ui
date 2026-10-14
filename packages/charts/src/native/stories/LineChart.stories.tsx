import type { Meta, StoryObj } from "@storybook/react-vite";

import CreatorEarningsExample from "../../../registry/examples/line-chart/native/creator-earnings";
import { chartsNativeFrame } from "./frame";

/** Native — Line chart. Each story renders a named example of the registry: the code ui.krizaka.com shows. */
const meta = { title: "Charts Native/LineChart", decorators: [chartsNativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const CreatorEarnings: Story = { render: () => <CreatorEarningsExample /> };
