import type { Meta, StoryObj } from "@storybook/react-vite";

import HorizontalExample from "../../registry/examples/separator/horizontal";
import VerticalExample from "../../registry/examples/separator/vertical";
import { Separator } from "./separator";

/**
 * A line between groups (Radix Separator): decorative by default, `decorative={false}` for a real separator.
 * Each story renders a named example of the registry (`registry/examples/separator/*`): the code krizaka.com/docs/ui shows.
 */
const meta = {
  title: "Primitives/Separator",
  component: Separator,
} satisfies Meta<typeof Separator>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Horizontal: Story = { render: () => <HorizontalExample /> };
export const Vertical: Story = { render: () => <VerticalExample /> };
