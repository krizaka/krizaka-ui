import type { Meta, StoryObj } from "@storybook/react-vite";

import AuctionRoomExample from "../../../registry/examples/price-ticker/native/auction-room";
import { chartsNativeFrame } from "./frame";

/** Native — PriceTicker, a ready-made chart. Each story renders a named example of the registry. */
const meta = { title: "Charts Native/PriceTicker", decorators: [chartsNativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const AuctionRoom: Story = { render: () => <AuctionRoomExample /> };
