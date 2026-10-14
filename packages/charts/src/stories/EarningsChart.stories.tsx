import type { Meta, StoryObj } from "@storybook/react-vite";

import CreatorMonthExample from "../../registry/examples/earnings-chart/creator-month";
import GrossAndNetExample from "../../registry/examples/earnings-chart/gross-and-net";
import { chartFrame } from "./frame";

/** EarningsChart — a ready-made chart. Each story renders a named example of the registry: the code ui.krizaka.com shows. */
const meta = { title: "Charts/EarningsChart", decorators: [chartFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const CreatorMonth: Story = { render: () => <CreatorMonthExample /> };
export const GrossAndNet: Story = { render: () => <GrossAndNetExample /> };
