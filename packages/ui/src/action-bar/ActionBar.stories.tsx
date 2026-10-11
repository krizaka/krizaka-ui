import type { Meta, StoryObj } from "@storybook/react-vite";

import ButtonsExample from "../../registry/examples/action-bar/buttons";
import IconsExample from "../../registry/examples/action-bar/icons";
import { ActionBar } from "./action-bar";

/** Action bar — a page block. Each story renders a named example. */
const meta = {
  title: "Blocks/ActionBar",
  component: ActionBar,
} satisfies Meta<typeof ActionBar>;
export default meta;

type Story = StoryObj;

export const Buttons: Story = { render: () => <ButtonsExample /> };
export const Icons: Story = { render: () => <IconsExample /> };
