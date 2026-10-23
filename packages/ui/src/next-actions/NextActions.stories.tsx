import type { Meta, StoryObj } from "@storybook/react-vite";

import ShopOwnerExample from "../../registry/examples/next-actions/shop-owner";
import { NextActions } from "./next-actions";

const meta = {
  title: "Blocks/NextActions",
  component: NextActions,
} satisfies Meta<typeof NextActions>;
export default meta;

type Story = StoryObj;

export const ShopOwner: Story = { render: () => <ShopOwnerExample />, parameters: { phone: true } };
