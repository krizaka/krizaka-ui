import type { Meta, StoryObj } from "@storybook/react-vite";

import ToneChipExample from "../../registry/examples/recipes/tone-chip";

/** Recipes — foundations. The story renders the named example of the registry. */
const meta = { title: "Foundations/Recipes" } satisfies Meta;
export default meta;

type Story = StoryObj;

export const ToneChip: Story = { render: () => <ToneChipExample /> };
