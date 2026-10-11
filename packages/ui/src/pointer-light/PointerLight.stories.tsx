import type { Meta, StoryObj } from "@storybook/react-vite";

import ListExample from "../../registry/examples/pointer-light/list";
import { PointerLight } from "./pointer-light";

/** Pointer light — a page block. Each story renders a named example. */
const meta = {
  title: "Blocks/PointerLight",
  component: PointerLight,
} satisfies Meta<typeof PointerLight>;
export default meta;

type Story = StoryObj;

export const List: Story = { render: () => <ListExample /> };
