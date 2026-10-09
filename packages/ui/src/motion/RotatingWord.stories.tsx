import type { Meta, StoryObj } from "@storybook/react-vite";

import { RotatingWord } from "./RotatingWord";

/** The headline signature: a word rolling through alternatives. Decorative — the heading keeps a stable label. */
const meta = {
  title: "Motion/RotatingWord",
  component: RotatingWord,
  args: { words: ["love", "follow", "support"], interval: 2600 },
  render: (args) => (
    <h1 aria-label="Creators you love" className="font-display text-4xl font-semibold text-fg">
      Creators you <RotatingWord {...args} className="text-accent" />
    </h1>
  ),
} satisfies Meta<typeof RotatingWord>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** One word: nothing rolls. */
export const SingleWord: Story = { args: { words: ["love"] } };
