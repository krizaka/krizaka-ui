import type { Meta, StoryObj } from "@storybook/react-vite";

import ShapesExample from "../../registry/examples/skeleton/native/shapes";
import { Skeleton } from "./skeleton";
import { nativeFrame } from "./story-frame";

/**
 * Native — a pulsing placeholder the size of what is loading, hidden from screen readers.
 * Each story renders a named example of the registry (`registry/examples/skeleton/native/*`): the code ui.krizaka.com shows.
 */
const meta = {
  title: "Native/Skeleton",
  component: Skeleton,
  decorators: [nativeFrame],
} satisfies Meta<typeof Skeleton>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Shapes: Story = { render: () => <ShapesExample /> };
