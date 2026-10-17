import type { Meta, StoryObj } from "@storybook/react-vite";

import DefaultExample from "../../registry/examples/account-menu/default";
import { AccountMenu } from "./account-menu";

/** Account menu — navigation. Each story renders a named example. */
const meta = {
  title: "Navigation/AccountMenu",
  component: AccountMenu,
  parameters: { layout: "padded" },
} satisfies Meta<typeof AccountMenu>;
export default meta;

type Story = StoryObj;

export const Default: Story = { render: () => <DefaultExample /> };
