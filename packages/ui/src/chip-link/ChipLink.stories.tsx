import type { Meta, StoryObj } from "@storybook/react-vite";

import FiltersExample from "../../registry/examples/chip-link/filters";
import { ChipLink } from "./chip-link";

/** A chip that is a link. Each story renders a named example. */
const meta = {
  title: "Primitives/ChipLink",
  component: ChipLink,
} satisfies Meta<typeof ChipLink>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Filters: Story = { render: () => <FiltersExample /> };
