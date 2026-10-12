import type { Meta, StoryObj } from "@storybook/react-vite";

import ButtonExample from "../../registry/examples/component-page/button";
import { ComponentPage } from "./component-page";

/** Component page — a page template. Each story renders a named example, on a desktop and on a phone. */
const meta = {
  title: "Templates/ComponentPage",
  component: ComponentPage,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ComponentPage>;
export default meta;

type Story = StoryObj;

export const Button: Story = { render: () => <ButtonExample /> };
/** On a phone (390 × 844). */
export const ButtonPhone: Story = { render: () => <ButtonExample />, parameters: { phone: true } };
