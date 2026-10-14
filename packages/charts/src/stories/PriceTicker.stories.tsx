import type { Meta, StoryObj } from "@storybook/react-vite";

import AuctionRoomExample from "../../registry/examples/price-ticker/auction-room";
import NoBidYetExample from "../../registry/examples/price-ticker/no-bid-yet";
import { chartFrame } from "./frame";

/** PriceTicker — a ready-made chart. Each story renders a named example of the registry: the code ui.krizaka.com shows. */
const meta = { title: "Charts/PriceTicker", decorators: [chartFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const AuctionRoom: Story = { render: () => <AuctionRoomExample /> };
export const NoBidYet: Story = { render: () => <NoBidYetExample /> };
