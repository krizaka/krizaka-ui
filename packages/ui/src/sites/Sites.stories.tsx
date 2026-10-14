import type { Meta, StoryObj } from "@storybook/react-vite";

import FamilyExample from "../../registry/examples/sites/family";
import FrenchExample from "../../registry/examples/sites/french";

/** The Krizaka family as data. Each story renders a named example of the registry (`registry/examples/sites/*`). */
const meta = {
  title: "Primitives/Sites",
  component: FamilyExample,
} satisfies Meta<typeof FamilyExample>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Family: Story = { render: () => <FamilyExample /> };
export const French: Story = { render: () => <FrenchExample /> };
