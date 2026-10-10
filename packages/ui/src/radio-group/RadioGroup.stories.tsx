import type { Meta, StoryObj } from "@storybook/react-vite";

import CardsExample from "../../registry/examples/radio-group/cards";
import HorizontalExample from "../../registry/examples/radio-group/horizontal";
import ItemsExample from "../../registry/examples/radio-group/items";
import { RadioGroup } from "./radio-group";

/**
 * `RadioGroup.Root/Item/Card` on Radix: one tab stop, the arrows move and choose.
 * Each story renders a named example of the registry (`registry/examples/radio-group/*`): the code krizaka.com/docs/ui shows.
 */
const meta = {
  title: "Primitives/RadioGroup",
  component: RadioGroup.Root,
  args: { label: "Notification frequency" },
} satisfies Meta<typeof RadioGroup.Root>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Items: Story = { render: () => <ItemsExample /> };
export const Cards: Story = { render: () => <CardsExample /> };
export const Horizontal: Story = { render: () => <HorizontalExample /> };
