import type { Meta, StoryObj } from "@storybook/react-vite";

import CurrenciesExample from "../../registry/examples/money-input/currencies";
import DefaultExample from "../../registry/examples/money-input/default";
import { MoneyInput } from "./money-input";

/** `MoneyInput`: an amount in integer cents, typed in the locale's way. Each story renders a named example. */
const meta = {
  title: "Primitives/MoneyInput",
  component: MoneyInput,
  args: { value: 0, onValueChange: () => {}, currency: "CAD", locale: "en-CA" },
} satisfies Meta<typeof MoneyInput>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <DefaultExample /> };
export const Currencies: Story = { render: () => <CurrenciesExample /> };
