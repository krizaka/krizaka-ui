import type { Meta, StoryObj } from "@storybook/react-vite";

import AuctionBidsExample from "../../registry/examples/candlestick/auction-bids";
import { chartFrame } from "./frame";

/** Candlestick. Each story renders a named example of the registry: the code ui.krizaka.com shows. */
const meta = { title: "Charts/Candlestick", decorators: [chartFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const AuctionBids: Story = { render: () => <AuctionBidsExample /> };
