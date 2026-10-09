import type { Meta, StoryObj } from "@storybook/react-vite";

import { RadioGroup } from "./radio-group";

/**
 * `RadioGroup.Root/Item/Card` on Radix: one tab stop, the arrows move and choose. `Item` is a dot and its words;
 * `Card` makes a whole card the radio (an amount, a pack, a payment method).
 */
const meta = {
  title: "Primitives/RadioGroup",
  component: RadioGroup.Root,
  args: { label: "Notification frequency", defaultValue: "daily" },
} satisfies Meta<typeof RadioGroup.Root>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Items: Story = {
  render: (args) => (
    <RadioGroup.Root {...args}>
      <RadioGroup.Item value="instant">Instantly</RadioGroup.Item>
      <RadioGroup.Item value="daily">Once a day</RadioGroup.Item>
      <RadioGroup.Item value="weekly">Once a week</RadioGroup.Item>
      <RadioGroup.Item value="never" disabled>
        Never
      </RadioGroup.Item>
    </RadioGroup.Root>
  ),
};

/** Whole cards: the chosen one carries the accent border and tint. */
export const Cards: Story = {
  args: { label: "Amount", defaultValue: "20" },
  render: (args) => (
    <RadioGroup.Root {...args} className="grid w-[30rem] max-w-full grid-cols-3 gap-3">
      {[
        ["5", "$5", "A coffee"],
        ["20", "$20", "A dinner"],
        ["50", "$50", "A night out"],
      ].map(([value, amount, hint]) => (
        <RadioGroup.Card key={value} value={value}>
          <span className="font-display text-lg font-bold">{amount}</span>
          <span className="text-xs text-fg-secondary">{hint}</span>
        </RadioGroup.Card>
      ))}
    </RadioGroup.Root>
  ),
};

/** `orientation="horizontal"`: left and right arrows, the items in a row. */
export const Horizontal: Story = {
  args: { orientation: "horizontal", label: "Quality", defaultValue: "1080" },
  render: (args) => (
    <RadioGroup.Root {...args} className="gap-5">
      <RadioGroup.Item value="720">720p</RadioGroup.Item>
      <RadioGroup.Item value="1080">1080p</RadioGroup.Item>
      <RadioGroup.Item value="2160">4K</RadioGroup.Item>
    </RadioGroup.Root>
  ),
};
